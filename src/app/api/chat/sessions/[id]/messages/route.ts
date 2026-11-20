import { NextRequest, NextResponse } from 'next/server'
import { createClient }  from '@/lib/supabase/server'
import { isUuid } from '@/lib/utils'
import { answerStudyQuestion, ChatInput } from '@/lib/ai/deepseek'
import { embedTexts } from '@/lib/ai/embeddings'

const MAX_Q_CHARS = 2000
export async function POST(request: NextRequest,
    {params} : {params: Promise<{id: string}>}
) {

    const {id} = await params
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if(!user) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    if(!isUuid(id)) {
        return NextResponse.json({error: 'session not found'}, {status: 404})
    }

    let body
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({error: 'invalid json'}, {status: 400})
    }

    if(typeof body.question !=='string' || body.question.length > MAX_Q_CHARS || !body.question.trim()) {
        return NextResponse.json({error: 'Invalid question'}, { status: 400})
    }

    const {data: session, error: sessionError} = await supabase
    .from('chat_sessions')
    .select('id, course_id, title')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

    if (sessionError) {
        console.error('failed to load session', sessionError)
        return NextResponse.json({error: 'failed to load session'}, {status: 500})
    }
    if (!session) {
        return NextResponse.json({error: 'Session unavailable'}, {status: 404})
    }
    if (!session.course_id) {
        return NextResponse.json({error: `this chat's course was deleted`}, {status: 409})
    }

    const question = body.question.trim()

    let questionVector: number[]
    try {
        ;[questionVector] = await embedTexts([question], 'RETRIEVAL_QUERY')
    } catch(error){
        console.error('failed to embed question', error)
        return NextResponse.json({error: 'failed to embed question'}, {status: 500})
    }
    const {data: chunks, error: chunkError} = await supabase.rpc('match_material_chunks', {
        query_embedding: JSON.stringify(questionVector),
        p_course_id: session.course_id,
        match_count: 6,
    })

    if(chunkError) {
        console.error('failed to load chunks', chunkError)
        return NextResponse.json({error: 'failed to load chunks'}, {status: 500})
    }



    const {data: materials, error: matError } = await supabase
    .from('materials')
    .select('id, title')
    .eq('course_id', session.course_id)

    if(matError) {
        console.error('error loading materials', matError)
        return NextResponse.json({error: 'failed to load materials'}, {status: 500})
    }

    const {data: course, error: corError } = await supabase 
    .from('courses')
    .select('name, code')
    .eq('id', session.course_id)
    .maybeSingle()

    if(corError){
        console.error('failed to load course', corError)
        return NextResponse.json({error: 'failed to load course'}, { status: 500})
    }
    if(!course) {
        return NextResponse.json({error: 'course not found'}, {status: 404})
    }

    const {data: upcomingAssignments, error: assError} =await supabase 
    .from('assignments')
    .select('title, due_date, status')
    .eq('course_id', session.course_id)
    .neq('status', 'completed')
    .gte('due_date', new Date().toISOString())
    .order('due_date', {ascending: true})
    .limit(10)

    if(assError){
        console.error('failed to load upcoming assignments', assError)
        return NextResponse.json({error: 'failed to load upcoming assignments'}, {status: 500})
    }


    const {data: history, error: hisError} = await supabase 
    .from('chat_messages')
    .select('role, content')
    .eq('session_id', session.id)
    .order('created_at', {ascending: false})
    .limit(10)
    
    if(hisError) {
        console.error('failed to load chat history', hisError)
        return NextResponse.json({error: 'failed to load chat history'}, {status: 500})
    }


    
    const newest = history?.[0]
    const alreadySaved = newest?.role === 'user' && newest.content === question

    const input: ChatInput = {
        course: course  ,
        materials: chunks.map((c) => ({
            id: c.material_id,
            title: materials.find((m) => m.id===c.material_id)?.title ?? 'Untitled',
            text: c.chunk_text})),
        upcomingAssignments: upcomingAssignments.map((u) => ({ title: u.title, dueDate: u.due_date, status: u.status})),
        history: (history ?? [])
            .slice(alreadySaved ? 1 : 0)
            .reverse()
            .map((h) => ({ role: h.role as 'user' | 'assistant', content: h.content })),
        question,
    }


    if(!alreadySaved) {
        const {error: questionError} = await supabase 
        .from('chat_messages')
        .insert({
            session_id: session.id,
            user_id: user.id,
            role: 'user',
            content: question,
        })

        if(questionError) {
            console.error('failed to save question', questionError)
            return NextResponse.json({error: 'failed to save question'}, {status: 500})
        }
    }

    if(!session.title) {
        const {error: titleError} = await supabase.from('chat_sessions').update({title: question.slice(0, 50)}).eq('id', session.id)
        if(titleError) {
            console.error('title update error', titleError)
        }
    }

    let result
    try {
        result = await answerStudyQuestion(input)
    } catch (err){
        console.error('AI chat failed', err)
        return NextResponse.json({error: 'the study assistant failed to answer the question, please try again'}, { status: 500})
    }
    

    const {data: message, error: answerError} = await supabase
    .from('chat_messages')
    .insert({
        session_id: session.id,
        user_id: user.id,
        role: 'assistant',
        content: result.answer,
        referenced_materials: result.materialIds
    })
    .select()
    .single()

    if(answerError) {
        console.error('failed to save answer', answerError)
        return NextResponse.json({error: ' failed to save answer'}, {status: 500})
    }



    return NextResponse.json({message}, {status: 201})
}

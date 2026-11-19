import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {isUuid} from '@/lib/utils'


export async function POST(request: NextRequest){

    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if(!user) {
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }

    const body = await request.json()

    if(!isUuid(body.courseId) || typeof body.courseId !== 'string' || !body.courseId.trim()) {
        return NextResponse.json({error: 'Course Id is required'}, {status: 400})
    }


    const {data: course, error: courseError} = await supabase
    .from('courses')
    .select('id')
    .eq('id', body.courseId)
    .eq('user_id', user.id)
    .maybeSingle()

    if (courseError) {
        return NextResponse.json({error: courseError.message}, {status: 500})
    }
    if(!course) { 
        return NextResponse.json({error: 'Course not found'}, {status: 404})
    }

    const {data: session, error} = await supabase
    .from('chat_sessions')
    .insert({
        user_id: user.id,
        course_id: body.courseId,
    })
    .select()
    .single()

    if(error) {
        console.error('error creating chat session', error)
        return NextResponse.json({error: 'Failed to create chat session'}, {status: 500})
    }
    
    return NextResponse.json({session}, {status: 201})
}
import {NextResponse, type NextRequest } from 'next/server'
import {createClient} from '@/lib/supabase/server'

export async function POST(request: NextRequest) {

    const supabase= await createClient()
    const {data: {user} } = await supabase.auth.getUser()

    if(!user){
        return NextResponse.json({error: 'Unauthorize'}, {status: 401})
    }

    const body = await request.json()
    if(!body.title?.trim() || !body.courseId || !body.dueDate) {
        return NextResponse.json({error: 'Course Title, Id, and due date are required'}, {status: 400})
    }

    const {data: course} = await supabase
    .from('courses')
    .select('id')
    .eq('id', body.courseId)
    .single()

    if (!course) {
        return NextResponse.json({error: 'Course not found'}, {status: 404})
    }

    const {data: assignment, error} = await supabase
    .from('assignments')
    .insert({
        user_id: user.id,
        course_id: body.courseId,
        title: body.title,
        due_date: body.dueDate,
    })
    .select()
    .single()

    if(error){
        return NextResponse.json({error: error.message}, { status: 500})
    }
    await supabase.from('student_context').insert({
        user_id: user.id,
        course_id: course.id,
    })

    return NextResponse.json({assignment}, {status: 201})
}

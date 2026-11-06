import {NextResponse, type NextRequest } from 'next/server'
import {createClient} from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    const supabase= await createClient()
    const {data: {user} } = await supabase.auth.getUser()
    if(!user){
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})
    }
    const body = await request.json()
    if(!body.name?.trim()) {
        return NextResponse.json({error: 'Name is required'}, {status: 400})
    }
    const {data: course, error} = await supabase
    .from('courses')
    .insert({
        user_id: user.id,
        name: body.name,
        code: body.code || null,
        professor: body.professor || null,
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

    return NextResponse.json({course}, {status: 201})
}

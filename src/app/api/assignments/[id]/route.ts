import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    if (!body.title?.trim() || !body.dueDate || !body.courseId) {
        return NextResponse.json({ error: 'Assignment Title, due Date, and ID are required' }, { status: 400 })
    }

    const {data: course} = await supabase
    .from('courses')
    .select('id')
    .eq('id', body.courseId)
    .single()

    if (!course) {
        return NextResponse.json({error: 'Assignment not found'}, {status: 404})
    }

    const { data: assignment, error } = await supabase
        .from('assignments')
        .update({
        title: body.title,
        course_id: body.courseId,
        due_date: body.dueDate,
        })
        .eq('id', id)
        .select()
        .single()

    if (error) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
        return NextResponse.json({ assignment })

}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{id: string}>} ) {
        const {id} = await params 
        const supabase = await createClient()
        const { data: {user}} = await supabase.auth.getUser()
        if (!user)
            return NextResponse.json({error: 'Unauthorized' }, {status: 401})

        // delete this courses files from storage 

        const {error} = await supabase.from('assignments').delete().eq('id', id)
        if(error)
            return NextResponse.json({error: error.message}, {status: 500})

        return NextResponse.json({message: 'Assignment Deleted'})
    }
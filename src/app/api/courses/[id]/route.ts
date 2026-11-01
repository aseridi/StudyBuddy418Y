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
  if (!body.name?.trim()) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const { data: course, error } = await supabase
    .from('courses')
    .update({
      name: body.name,
      code: body.code || null,
      professor: body.professor || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  return NextResponse.json({ course })
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

        const {error} = await supabase.from('courses').delete().eq('id', id)
        if(error)
            return NextResponse.json({error: error.message}, {status: 500})

        return NextResponse.json({message: 'Course Deleted'})
    }
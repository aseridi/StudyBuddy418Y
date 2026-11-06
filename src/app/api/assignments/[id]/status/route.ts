import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
    request: NextRequest,
    {params}: {params: Promise<{id: string}>}
) {
    const {id} = await params
    const supabase = await createClient()
    const{data:{user}} = await supabase.auth.getUser()
    if(!user)
        return NextResponse.json({error: 'Unauthorized'}, {status: 401})

    const body = await request.json()
    const statusValues = ['not_started', 'in_progress', 'completed']
    if(!statusValues.includes(body.status)) {
        return NextResponse.json({error: "Invalid status"}, {status: 400})
    }
    const {data: assignment, error} = await supabase
    .from('assignments')
    .update({
        status: body.status,
    })
    .eq('id', id)
    .select().single()

    if(error)
        return NextResponse.json({error: "assignment does not exist"}, {status: 404})

    return NextResponse.json({assignment})
}
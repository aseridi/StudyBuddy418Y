import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
    request: NextRequest,
    { params}: {params: Promise<{id: string}>}) {
        const {id} = await params
        const supabase = await createClient()
        const {data: {user}} = await supabase.auth.getUser()

        if(!user) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 401})
        }

        const { data: material, error: findError} = await supabase
        .from('materials')
        .select('file_url')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle()

        if(findError) {
            return NextResponse.json({error: findError.message}, {status: 500})
        }

        if(!material) {
            return NextResponse.json({error: 'Material not found'}, {status: 404})
        }

        if(material.file_url) {
            const {error: deleteError} = await supabase.storage.from('materials').remove([material.file_url])
            if(deleteError) {
                return NextResponse.json({error: deleteError.message}, {status: 500})
            }
        }
        const {error: deleteRowError} = await supabase.from('materials').delete().eq('id', id).eq('user_id', user.id)
        if(deleteRowError) {
            return NextResponse.json({error: deleteRowError.message}, {status: 500})
        }

        return NextResponse.json({message: 'Material deleted successfully'})
        
    }
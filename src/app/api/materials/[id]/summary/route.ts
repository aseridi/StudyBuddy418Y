import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { summarizeMaterial } from '@/lib/ai/deepseek'

export async function POST(request: NextRequest,
    {params}: {params: Promise<{id: string}>})
    {
            const { id } = await params
            const supabase = await createClient()

            const { data: {user}} = await supabase.auth.getUser()

            if(!user) {
                return NextResponse.json({error: 'Unauthorized'}, {status: 401})
            }

            const { data: material, error: findError} = await supabase
            .from('materials')
            .select('title, material_type, raw_text, is_processed')
            .eq('user_id', user.id)
            .eq('id', id)
            .maybeSingle()

            if(findError) {
                return NextResponse.json({error: findError.message}, {status: 500})
            }

            if(!material){
                return NextResponse.json({error: 'Material not found'}, {status: 404})
            }

            if(!material.raw_text) {
                return NextResponse.json({error: 'Material has no text to summarize'}, {status: 400})
            }

            if(material.is_processed) {
                return NextResponse.json({error: 'Material already processed'}, {status: 409})
            }

            let result
            try {
                result = await summarizeMaterial({
                    title: material.title,
                    materialType: material.material_type,
                    text: material.raw_text
                })
            } catch (error) {
                console.error('error summarizing material', error)
                return NextResponse.json({error: 'Failed to summarize material'}, {status: 500})
            }

            const { data: updateData, error: updateError} = await supabase
            .from('materials')
            .update({
                summary: result.summary,
                extracted_topics: result.topics,
                is_processed: true
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select('summary, extracted_topics, is_processed')
            .maybeSingle()

            if(updateError) {
                return NextResponse.json({error: updateError.message}, {status: 500})
            }
            
            return NextResponse.json({material: updateData} , {status: 200})
            
    }
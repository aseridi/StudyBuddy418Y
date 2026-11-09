import { NextRequest, NextResponse} from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_TYPES: Record<string, string> ={
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/plain': 'txt'
}

const MAX_SIZE = 10*1024*1024

export async function POST(request: NextRequest) {
    const supabase = await createClient()
    const {data: {user}} = await supabase.auth.getUser()

    if(!user){
        return NextResponse.json({error: "Unauthorized"}, {status: 401})
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const courseId = formData.get('courseId')
    const title = formData.get('title')

    if(!(file instanceof File)) {
        return NextResponse.json({error: 'A file is required'}, {status: 400})
    }
    if (typeof courseId !== 'string' || !courseId) {
        return NextResponse.json({error: 'a course id is required'}, {status: 400})
    }

    if(file.size > MAX_SIZE) {
        return NextResponse.json({error: 'File size exceeds 10MB limit'}, {status: 400})
    }
    if(file.size ===0) {
        return NextResponse.json({error: 'file is empty'}, {status: 400})
    }

    const materialType = ALLOWED_TYPES[file.type]
    if (!materialType) {
        return NextResponse.json({error: 'Only PDF, DOCX, or TEXT files are allowed'}, {status: 400})
    }

    const {data: course} = await supabase
    .from('courses')
    .select('id')
    .eq('id', courseId)
    .single()

    if(!course) { 
        return NextResponse.json({error: 'Course not found'}, {status: 404})
    }


    return NextResponse.json({name: file.name, size: file.size, type: file.type, courseId, materialType})

}
import { NextRequest, NextResponse} from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {extractMaterialText} from '@/lib/files/extract-text'

const ALLOWED_TYPES: Record<string, string> ={
    'application/pdf': 'pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/plain': 'txt'
}

const MAX_SIZE = 10*1024*1024

const MATERIAL_TYPES = ['syllabus', 'lecture_notes', 'slides', 'textbook', 'assignment_doc', 'announcement', 'other']

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
    const rawType = formData.get('type')

    if(!(file instanceof File)) {
        return NextResponse.json({error: 'A file is required'}, {status: 400})
    }
    if (typeof courseId !== 'string' || !courseId) {
        return NextResponse.json({error: 'a course id is required'}, {status: 400})
    }

    const type = rawType === null || rawType === '' ? 'other': rawType

   if(typeof type !== 'string' || !MATERIAL_TYPES.includes(type)) {
    return NextResponse.json({error: 'invalid material type'}, {status: 400})
   }


    if(file.size > MAX_SIZE) {
        return NextResponse.json({error: 'File size exceeds 10MB limit'}, {status: 400})
    }
    if(file.size ===0) {
        return NextResponse.json({error: 'file is empty'}, {status: 400})
    }
    const extension = ALLOWED_TYPES[file.type]
    if (!extension) {
        return NextResponse.json({error: 'Only PDF, DOCX, or TXT files are allowed'}, {status: 400})
    }

    const {data: course} = await supabase
    .from('courses')
    .select('id')
    .eq('id', courseId)
    .single()

    if(!course) { 
        return NextResponse.json({error: 'Course not found'}, {status: 404})
    }

    const materialId = crypto.randomUUID()
    const filePath = `${user.id}/${materialId}.${extension}`

    const {error: uploadError} = await supabase.storage
    .from('materials')
    .upload(filePath, file, {contentType: file.type})

    if(uploadError) {
        console.error('Upload error', uploadError)
        return NextResponse.json({error: 'Failed to upload file to storage'}, {status: 500})
    }


    const buffer = Buffer.from(await file.arrayBuffer())

    let rawText: string | null = null
    let processingError: string | null = null

    try {
        const parsed = await extractMaterialText(buffer, extension)
        rawText = parsed.trim() || null
        if (!rawText) {
            processingError = 'no text found in file (could be a scanned image needing OCR)'
        } 
    } catch (error) {
        processingError = 'could not read text from this file'
        console.error(`[upload] text extraction failed for ${file.name}`, error)
    }


    const finalTitle = typeof title === 'string' && title.trim()
    ? title.trim() : file.name.replace(/\.[^.]+$/, '')

    const materialData = {
        user_id: user.id,
        course_id: courseId,
        title: finalTitle,
        material_type: type,
        raw_text: rawText,
        file_url: filePath,
        file_size: file.size,
        original_filename: file.name,
        is_processed: false,
        processing_error: processingError,
    }

    const { data: material, error: insertError} = await supabase
    .from('materials')
    .insert(materialData)
    .select()
    .single()

    if(insertError) {
        console.error('insert error', insertError)
        await supabase.storage.from('materials').remove([filePath])
        return NextResponse.json({error: 'unable to add file'}, {status: 500})
    }


    return NextResponse.json({material}, {status: 201})

}
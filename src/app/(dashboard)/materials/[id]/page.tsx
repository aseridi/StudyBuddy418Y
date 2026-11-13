'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/database'
import { useParams } from 'next/navigation'

type MaterialDetail = Pick<Tables<'materials'>, 'title' | 'material_type' | 'created_at' | 'is_processed' | 'processing_error' | 'raw_text'
> & {courses : {name: string} | null }

export default function MaterialDetailPage() {
    const [error, setError] = useState('')
    const [loading, setLoading ] = useState(true)

    const [material, setMaterial] = useState<MaterialDetail | null> (null)
    const {id} = useParams<{id: string}>()

    useEffect(() =>  {
        async function loadMaterial() {
            const {data, error} = await createClient()
            .from('materials')
            .select('title, material_type, created_at, is_processed, processing_error, raw_text, courses(name)')
            .eq('id', id)
            .maybeSingle()

            if(error) {
                setError(error.message)
                setLoading(false)
                return
            }

            setMaterial(data)
            setLoading(false)
            
        }
        loadMaterial()
    }, [id])

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error : {error}</p>
    if(!material) return <p>Material not found</p>

    return (
        <div>
            <p>Title: {material.title}</p>
            <p>Course name: {material.courses?.name}</p>
            <p>Material Type: {material.material_type}</p>
            <p>Created: {material.created_at ? new Date(material.created_at).toLocaleDateString() : '—'}</p>
            <p>Raw Text: {material.raw_text?.slice(0, 500)}</p>
            {material.processing_error? (
                <p>Could not read text from this file: {material.processing_error}</p>
            ): material.is_processed ? (
                <p>Summary ready</p>
            ) : (
                <p>Text extracted. summary not generated yet</p>
            )}

        </div>
    )
}
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Tables } from '@/types/database'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Trash2 } from 'lucide-react'


type MaterialDetail = Pick<Tables<'materials'>, 'title' | 'material_type' | 'created_at' | 'is_processed' | 'processing_error' | 'raw_text' |'file_url' |'course_id' | 'summary' | 'extracted_topics'
> & {courses : {name: string} | null }

export default function MaterialDetailPage() {
    const [error, setError] = useState('')
    const [loading, setLoading ] = useState(true)

    const [material, setMaterial] = useState<MaterialDetail | null> (null)
    const {id} = useParams<{id: string}>()
    const [fileError, setFileError] = useState('')
    const [summaryError, setSummaryError] = useState('')
    const [summarizing, setSummarizing] = useState(false)

    useEffect(() =>  {
        async function loadMaterial() {
            const {data, error} = await createClient()
            .from('materials')
            .select('title, material_type, created_at, is_processed, processing_error, raw_text, file_url, course_id, summary, extracted_topics, courses(name)')
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

    async function handleViewFile() {
        setFileError('')
        if(!material?.file_url) return

        const {data, error } = await createClient()
        .storage
        .from('materials')
        .createSignedUrl(material.file_url, 120)

        if(error) {
            setFileError(error.message)
            return
        }
        window.open(data.signedUrl, '_blank')
    }

    async function handleDelete() {
        setFileError('')
        if(!material) return
        if(!confirm('Delete this material?')) return

        const res = await fetch(`/api/materials/${id}`, {method: 'DELETE'})
        if(!res.ok) {
            const body = await res.json()
            setFileError(body.error ?? 'Could not delete material')
            return
        }
        window.location.href = `/courses/${material.course_id}`
    }

    async function handleGenerateSummary() {
        setSummaryError('')
        setSummarizing(true)
        try {
            const res = await fetch(`/api/materials/${id}/summary`, {method: 'POST'})
            const body = await res.json()
            if(!res.ok) {
                setSummaryError(body.error ?? 'Could not generate summary')
                return
            }
            setMaterial(prev => prev && { ...prev, ...body.material })
            setSummaryError('') 
        } finally {
            setSummarizing(false)
        }
    }

    if(loading) return <p className="text-gray-500">Loading material...</p>
    if(error) return <p className="rounded-lg bg-red-50 p-4 text-red-700">Error: {error}</p>
    if(!material) return <p className="rounded-lg bg-red-50 p-4 text-red-700">Material not found</p>

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <Link href={`/courses/${material.course_id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> Back to {material.courses?.name ?? 'course'}
            </Link>

            {/* Header card */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                            {material.material_type.replaceAll('_', ' ')}
                        </p>
                        <h1 className="mt-1 break-words text-2xl font-bold text-gray-900">{material.title}</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            {material.courses?.name}
                            {material.created_at && ` · Uploaded ${new Date(material.created_at).toLocaleDateString()}`}
                        </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Button variant="outline" onClick={handleViewFile} leftIcon={<ExternalLink className="h-4 w-4" />}>
                            View file
                        </Button>
                        <Button variant="danger" onClick={handleDelete} leftIcon={<Trash2 className="h-4 w-4" />}>
                            Delete
                        </Button>
                    </div>
                </div>
                {fileError && <p className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{fileError}</p>}
            </div>

            {/* Summary */}
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
                    <h2 className="font-semibold text-gray-900">Summary</h2>
                    {!material.processing_error && !material.is_processed && (
                        <Button size="sm" isLoading={summarizing} onClick={handleGenerateSummary}>
                            {summaryError ? 'Try again' : 'Generate summary'}
                        </Button>
                    )}
                </div>
                <div className="space-y-4 p-5">
                    {material.processing_error ? (
                        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                            Could not read text from this file: {material.processing_error}
                        </p>
                    ) : material.is_processed ? (
                        <>
                            <p className="whitespace-pre-wrap text-gray-700">{material.summary}</p>
                            {material.extracted_topics && material.extracted_topics.length > 0 && (
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold text-gray-900">Key concepts</h3>
                                    <ul className="flex flex-wrap gap-2">
                                        {material.extracted_topics.map((t) => (
                                            <li key={t} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">{t}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-gray-500">
                                {summarizing
                                    ? 'Generating summary. This can take up to a minute...'
                                    : 'Text extracted. No summary yet.'}
                            </p>
                            {summaryError && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{summaryError}</p>}
                        </>
                    )}
                </div>
            </section>

            {/* Extracted text preview */}
            {material.raw_text && (
                <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex h-16 items-center border-b border-gray-200 px-5">
                        <h2 className="font-semibold text-gray-900">Extracted text preview</h2>
                    </div>
                    <p className="whitespace-pre-wrap p-5 text-sm text-gray-600">
                        {material.raw_text.slice(0, 500)}{material.raw_text.length > 500 && '…'}
                    </p>
                </section>
            )}
        </div>
    )
}

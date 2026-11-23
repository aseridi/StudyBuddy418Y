'use client'

import { useState } from 'react'
import { MATERIAL_TYPES } from '@/lib/materials'
import { Button } from '@/components/ui/Button'
import { Tables } from '@/types/database'
import { Input } from '@/components/ui/Input'

type Props = { courseId: string
    onUploaded: (material: Tables<'materials'>) => void
}


export function UploadMaterialForm({courseId, onUploaded}: Props) {
    const [file, setFile] = useState<File | null> (null)
    const [type, setType] = useState('other')
    const [title, setTitle] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')

        if(!file) {
            setError('Please choose a file')
            return
        }
        setLoading(true)

        const formData = new FormData()
        formData.append('file', file)
        formData.append('courseId', courseId)
        formData.append('title', title)
        formData.append('type', type)

        const res = await fetch('/api/materials', {
            method: 'POST',
            body: formData
        })

        const json = await res.json()
        if(!res.ok) {
            setError(json.error)
            setLoading(false)
            return
        }
        setLoading(false)
        onUploaded(json.material)

    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
                <label htmlFor="materialFile" className="block text-sm font-medium text-gray-700">File</label>
                <input
                    id="materialFile"
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    required
                    className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500">PDF, DOCX or TXT, up to 10 MB.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <label htmlFor="materialType" className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        id="materialType"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm capitalize text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {MATERIAL_TYPES.map((t) => (
                            <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>
                        ))}
                    </select>
                </div>
                <Input
                    id="materialTitle"
                    label="Title (optional)"
                    type="text"
                    placeholder="Defaults to the file name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <div className="flex justify-end">
                <Button type="submit" isLoading={loading}>Upload</Button>
            </div>
        </form>
    )
}

'use client'

import { useState } from 'react'
import { MATERIAL_TYPES } from '@/lib/materials'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Props = { courseId: string}


export function UploadMaterialForm({courseId}: Props) {
    const [file, setFile] = useState<File | null> (null)
    const [type, setType] = useState('other')
    const [title, setTitle] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        console.log(file, type, title)

    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input 
                type ='file'
                accept='.pdf,.docx,.txt'
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                required/>
            <select value={type} onChange={(e) => setType(e.target.value)}>
                {MATERIAL_TYPES.map((t) => (
                    <option key={t} value={t}>{t.replaceAll('_', ' ')}</option>
                ))}
            </select>

            <Input
                type='text'
                placeholder='Title (optional, defaults to file name)'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
            {error && <p>{error}</p>}

            <Button type="submit" isLoading={loading}>Upload</Button>
        </form>
    )
}
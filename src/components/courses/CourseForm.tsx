'use client'; 
import { Button } from '@/components/ui/Button';
import { useState } from 'react'
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import {Tables} from '@/types/database'
import { ArrowLeft } from 'lucide-react'
import { url } from 'inspector';



type Props = {course?: Tables<'courses'>}

export function CourseForm({course}: Props) {

    const [name, setName]= useState(course?.name ?? '')
    const [code, setCode] = useState(course?.code ?? '')
    const [professor, setProfessor] = useState(course?.professor?? '')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setLoading(true)

        const url = course ? `/api/courses/${course.id}` : '/api/courses'
        const method = course ? 'PUT' : 'POST'

        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({name, code, professor})
        })
        const json = await res.json()
        if(!res.ok) {
            setError(json.error)
            setLoading(false)
            return 
        }
        window.location.href = course ? `/courses/${course.id}` : '/courses'

    }

    const backHref = course ? `/courses/${course.id}` : '/courses'

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> Back
            </Link>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">
                    {course ? 'Edit course' : 'New course'}
                </h1>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        id="name"
                        label="Course name"
                        type="text"
                        placeholder="e.g. Software Engineering"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        id="code"
                        label="Course code"
                        type="text"
                        placeholder="e.g. ICSI 418Y"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <Input
                        id="professor"
                        label="Professor"
                        type="text"
                        placeholder="e.g. Dr. Smith"
                        value={professor}
                        onChange={(e) => setProfessor(e.target.value)}
                    />

                    {error && (
                        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <Link
                            href={backHref}
                            className="inline-flex h-10 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <Button type="submit" isLoading={loading}>
                            {course ? 'Save changes' : 'Add course'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
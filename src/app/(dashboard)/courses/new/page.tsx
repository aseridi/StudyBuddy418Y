'use client'; 
import { Button } from '@/components/ui/Button';
import { useState } from 'react'
import Link from 'next/link';
import { Input } from '@/components/ui/Input';


export default function NewCourse() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [name, setName] = useState('')
    const [professor, setProfessor] = useState('')
    const [code, setCode] = useState('')

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setLoading(true)

        const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, professor }),
        })
        const json = await res.json()
        if (!res.ok) {
        setError(json.error)
        setLoading(false)
        return
        }
        window.location.href = '/courses'
    }
    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border p-8 space-y-4">
            <h1>Create Course</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <Input
                type="text"
                placeholder="Course Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                />
                <Input
                type="text"
                placeholder="professor name"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                required
                />
                <Input
                type="text"
                placeholder ="course code"
                value = {code}
                onChange={(e) => setCode(e.target.value)}
                required/>
                {error && <p>{error}</p>}
                <Button type="submit" isLoading={loading}>Add Course</Button>
            </form>
        </div>
    )

}


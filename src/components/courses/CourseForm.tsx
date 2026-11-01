'use client'; 
import { Button } from '@/components/ui/Button';
import { useState } from 'react'
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import {Tables} from '@/types/database'



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

    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border p-8 space-y-4">
            <h1>{course ? 'Edit Course' : 'Create Course'}</h1>
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
                <Button type="submit" isLoading={loading}>{course ? 'Update Course' : 'Add Course'}</Button>
            </form>
        </div>
    )

}
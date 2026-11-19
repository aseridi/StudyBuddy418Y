'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {createClient} from '@/lib/supabase/client'
import type {Tables} from '@/types/database'
import Link from 'next/link'
import {Button} from '@/components/ui/Button'


type CourseOption = Pick<Tables<'courses'>, 'id' | 'name' | 'code'>

export default function ChatPage() {
    const [courses, setCourses] = useState<CourseOption[]>([])
    const [courseId, setCourseId] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const router = useRouter()
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState('')

    useEffect(()=> {
        async function load() {
            const {data, error} = await createClient()
            .from('courses')
            .select('id, name, code')
            .order('created_at', {ascending: false})

            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }
            setCourses(data)
            setLoading(false)
        }
        load()
    }, [])

    async function handleNewChat() {
        setCreating(true)
        setCreateError('')

        try {
        const res = await fetch(`/api/chat/sessions`, {
            method: 'POST',
            headers:{'Content-Type': 'application/json'},
            body: JSON.stringify({courseId}),
        })

        const data = await res.json()

        if(!res.ok) {
            setCreateError(data.error ?? 'could not start chat')
            return
        }
        router.push(`/chat/${data.session.id}`)
    } finally {
        setCreating(false)
    }

    }


    if(loading) return <p>Loading ...</p>
    if(error) return <p>Error:{error}</p>
    if(courses.length===0) return (
    <div>
        <p>No courses yet</p>
        <Link href="/courses/new">Add Course</Link>
    </div>
    )
    return (
        <div>
            <h1>Study Assistant</h1>
                <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                    <option value="">Choose a course</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.name}{course.code ? ` (${course.code})` : ''}
                        </option>
                    ))}
                </select>
                <Button onClick={handleNewChat} isLoading={creating} disabled={!courseId}>New Chat</Button>
                {createError && <p>{createError}</p>}
        </div>
    )

}
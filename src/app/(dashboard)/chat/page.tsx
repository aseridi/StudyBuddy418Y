'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {createClient} from '@/lib/supabase/client'
import type {Tables} from '@/types/database'
import Link from 'next/link'
import {Button} from '@/components/ui/Button'
import { ChevronRight, MessageSquarePlus } from 'lucide-react'


type CourseOption = Pick<Tables<'courses'>, 'id' | 'name' | 'code'>
type ChatSessionItem = {
    id: string
    title: string | null
    created_at: string | null 
    courses : {name: string} | null 
}

export default function ChatPage() {
    const [courses, setCourses] = useState<CourseOption[]>([])
    const [courseId, setCourseId] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const router = useRouter()
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState('')
    const [sessions, setSessions] = useState<ChatSessionItem[]>([])

    useEffect(()=> {
        async function load() {
            
            const supabase = createClient()

            const {data, error} = await supabase
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

            const { data: sessionData, error: sessionError } = await supabase
            .from('chat_sessions')
            .select('id, title, created_at, courses(name)')
            .order('created_at', { ascending: false })

            if(sessionError) {
                setError(sessionError.message)
                setLoading(false)
                return
            }

            setSessions(sessionData ?? [])
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


    if(loading) return <p className="text-gray-500">Loading...</p>
    if(error) return <p className="rounded-lg bg-red-50 p-4 text-red-700">Error: {error}</p>
    if(courses.length===0) return (
        <div className="mx-auto max-w-3xl rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-gray-600">Add a course before starting a study chat.</p>
            <Link href="/courses/new" className="mt-2 inline-block font-medium text-blue-600 hover:underline">
                Add your first course
            </Link>
        </div>
    )
    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Study assistant</h1>

            <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="font-semibold text-gray-900">Start a new chat</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Answers use the selected course, its materials and its upcoming assignments.
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <label htmlFor="chatCourse" className="sr-only">Course</label>
                    <select id="chatCourse" value={courseId} onChange={(e) => setCourseId(e.target.value)} className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:flex-1">
                        <option value="">Choose a course</option>
                        {courses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.name}{course.code ? ` (${course.code})` : ''}
                            </option>
                        ))}
                    </select>
                    <Button onClick={handleNewChat} isLoading={creating} disabled={!courseId} leftIcon={<MessageSquarePlus className="h-4 w-4" />}>
                        New chat
                    </Button>
                </div>
                {createError && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{createError}</p>}
            </section>

            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
                    <h2 className="font-semibold text-gray-900">Past chats</h2>
                    <span className="text-sm text-gray-500">{sessions.length}</span>
                </div>
                {sessions.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-gray-500">No chats yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {sessions.map((s) => (
                            <li key={s.id}>
                                <Link href={`/chat/${s.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50">
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-gray-900">{s.title ?? 'Untitled chat'}</p>
                                        <p className="text-sm text-gray-500">
                                            {s.courses?.name ?? 'Course deleted'}
                                            {s.created_at && ` · ${new Date(s.created_at).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}

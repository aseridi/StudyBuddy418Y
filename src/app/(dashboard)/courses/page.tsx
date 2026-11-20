'use client'
import {useEffect, useState} from 'react'
import {createClient } from '@/lib/supabase/client'
import type {Tables} from '@/types/database'
import Link from 'next/link'



export default function CoursePage() {
    const [courses, setCourses] = useState<Tables<'courses'>[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    useEffect(()=> {
        async function load() {
            const {data, error} = await createClient()
            .from('courses')
            .select('*')
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

        if (loading) return <p className="text-gray-500">Loading courses...</p>
    if (error) return <p className="rounded-lg bg-red-50 p-4 text-red-700">Error: {error}</p>

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
                <Link
                    href="/courses/new"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Add course
                </Link>
            </div>

            {courses.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                    <p className="text-gray-600">No courses yet.</p>
                    <Link href="/courses/new" className="mt-2 inline-block font-medium text-blue-600 hover:underline">
                        Add your first course
                    </Link>
                </div>
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <li key={course.id}>
                            <Link
                                href={`/courses/${course.id}`}
                                className="block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="h-2" style={{ backgroundColor: course.color ?? '#2563eb' }} />
                                <div className="p-4">
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        {course.code ?? 'No code'}
                                    </p>
                                    <h2 className="mt-1 text-lg font-semibold text-gray-900">{course.name}</h2>
                                    {course.professor && <p className="mt-1 text-sm text-gray-600">{course.professor}</p>}
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
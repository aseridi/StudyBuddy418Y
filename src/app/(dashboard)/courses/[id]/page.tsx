'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type {Tables} from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function CourseDetailPage() {

    const [course, setCourse] = useState<Tables<'courses'> | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const {id} = useParams<{id: string}>()
    useEffect(()=> {
        async function loadCourse() {
            const {data, error} = await createClient()
            .from('courses')
            .select('*')
            .eq('id', id)
            .single()

            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }
            setCourse(data)
            setLoading(false)
        }
        loadCourse()
    }, [id])

    if(loading) return <p>Loading ...</p>
    if (error || !course) return <p> Course not found </p>

    return (
        <div>
            <Link href="/courses"
                className="inline-flex items-center h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                > Back to courses
            </Link>
            <Link
                href={`/courses/${id}/edit`}
                className="inline-flex items-center h-10 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                Edit Course
            </Link>
            <h1>{course.name}</h1>
            {course.code && <p> Code: {course.code}</p>}
            {course.professor && <p>Professor: {course.professor}</p>}
            {course.description && <p>{course.description}</p>}
        </div>
    )
}
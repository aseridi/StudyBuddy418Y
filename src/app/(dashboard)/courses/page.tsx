'use client'
import {useEffect, useState} from 'react'
import {createClient } from '@/lib/supabase/client'
import type {Tables} from '@/types/database'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'



export default function CoursePage() {
    const [courses, setCourses] = useState<Tables<'courses'>[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [showArchived, setShowArchived] = useState(false)

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

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>

    const visibleCourse = courses.filter((c) => showArchived ? c.is_active === false : c.is_active !== false )

    if (courses.length ===0) return <div>
        <p> No Courses Yet.</p>
        <Link href="/courses/new"> Add Course</Link>
    </div>

    return (
        <div>
            <h1> Courses </h1>
            <Button onClick={() => setShowArchived(!showArchived)}>{showArchived? 'Show Active': 'Show Archived'}</Button>
            {visibleCourse.length === 0? (
                <p>{showArchived ? 'No archive course' : 'No active couurse'} </p>
            ) : (
                <ul>
                    {visibleCourse.map((course) => (
                        <li key = {course.id}>
                            <Link href={`/courses/${course.id}`}>{course.name}</Link>
                        </li>
                    ))}
                </ul>
            )}
            <Link href="/courses/new"> Add Course</Link>
        </div>
    )
}
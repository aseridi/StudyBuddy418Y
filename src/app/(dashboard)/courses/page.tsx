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

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>
    if (courses.length ===0) return <div>
        <p> No Courses Yet.</p>
        <Link href="/courses/new"> Add Course</Link>
    </div>

    return (
        <div>
            <h1> Courses </h1>
            <ul>
                {courses.map((course) => (
                    <li key = {course.id}>
                        <Link href={`/courses/${course.id}`}>{course.name}</Link>
                    </li>
                ))}
            </ul>
            <Link href="/courses/new"> Add Course</Link>

        </div>
    )
}
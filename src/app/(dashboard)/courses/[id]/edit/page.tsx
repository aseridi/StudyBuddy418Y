'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type {Tables} from '@/types/database'
import { CourseForm } from '@/components/courses/CourseForm'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

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

    return <CourseForm course={course} />
}
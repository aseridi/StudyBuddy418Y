'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type {Tables} from '@/types/database'
import { AssignmentForm } from '@/components/assignments/AssignmentForm'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AssignmentDetailPage() {

    const [assignment, setAssignment] = useState<Tables<'assignments'> | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const {id} = useParams<{id: string}>()
    useEffect(()=> {
        async function loadCourse() {
            const {data, error} = await createClient()
            .from('assignments')
            .select('*')
            .eq('id', id)
            .single()

            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }
            setAssignment(data)
            setLoading(false)
        }
        loadCourse()
    }, [id])

    if(loading) return <p>Loading ...</p>
    if (error || !assignment) return <p> Course not found </p>

    return <AssignmentForm assignment={assignment} />
}
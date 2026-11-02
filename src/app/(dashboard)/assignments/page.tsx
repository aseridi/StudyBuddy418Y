'use client'
import {useEffect, useState} from 'react'
import {createClient } from '@/lib/supabase/client'
import type {Tables} from '@/types/database'
import Link from 'next/link'


type AssignmentWithCourse = Tables<'assignments'> & {
  courses: { name: string } | null
}

export default function AssignmentsPage() {
    const [assignments, setAssignments] = useState<AssignmentWithCourse[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    useEffect(()=> {
        async function load() {
            const {data, error} = await createClient()
            .from('assignments')
            .select('*, courses(name)')
            .order('due_date', {ascending: true})

            if (error) {
                setError(error.message)
                setLoading(false)
                return
            }
            setAssignments(data)
            setLoading(false)
        }
        load()
    }, [])

    if(loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>
    if (assignments.length ===0) return <div>
        <p> No assingmnets Yet.</p>
        <Link href="/assignments/new"> Add Assignments</Link>
    </div>

    return (
        <div>
            <h1> Assignments </h1>
            <ul>
                {assignments.map((a)=> (
                    <li key ={a.id}>
                        {a.title}: {a.courses?.name}, due {new Date(a.due_date).toLocaleString()}
                    </li>
                ))}
            </ul>
            <Link href="/assignments/new"> Add Assignment</Link>

        </div>
    )
}
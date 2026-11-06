'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Tables } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

type AssignmentWithCourse = Tables<'assignments'> & {courses: {name: string} | null }

export default function AssignmentDetailPage() {
    const [assignment, setAssignment] = useState<AssignmentWithCourse | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        async function loadAssignment() {
        const { data, error } = await createClient()
        .from('assignments')
        .select('*, courses(name)')
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
        loadAssignment()
    }, [id])

    if (loading) return <p>Loading ...</p>
    if (error || !assignment) return <p>Assignment not found</p>

    async function handleDelete() {
        if (!confirm(`Delete "${assignment!.title}"?.`)) return
            const res = await fetch(`/api/assignments/${id}`, { method: 'DELETE' })
        if (!res.ok) {
            alert('Could not delete assignment')
            return
        }
        window.location.href = '/assignments'
    }

    async function handleStatusChange(newStatus: string) {
        const res = await fetch(`/api/assignments/${id}/status`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({status: newStatus}),
        })

        if(!res.ok) {
            alert('Could not update status')
            return
        }

        setAssignment({...assignment!, status: newStatus})
    }

    return (
        <div>
            <Link href="/assignments">Back to assignments</Link>
            <h1>{assignment.title}</h1>
            <p>Course:{' '} 
                <Link href={`/courses/${assignment.course_id}`}>{assignment.courses?.name}</Link>
            </p>
            <p>Due: {new Date(assignment.due_date).toLocaleString()}</p>
            <p>Priority: {assignment.priority}</p>
            <p>Progress</p>
            <Button variant={assignment.status === 'not_started' ? 'primary' : 'outline'} onClick={() => handleStatusChange('not_started')}>Not Started</Button>
            <Button variant={assignment.status === 'in_progress' ? 'primary' : 'outline'}onClick={() => handleStatusChange('in_progress')}>In Progress</Button>
            <Button variant={assignment.status === 'completed' ? 'primary' : 'outline'} onClick={() => handleStatusChange('completed')}>Completed</Button>

            {assignment.description && <p>{assignment.description}</p>}
            <Link href={`/assignments/${id}/edit`}>Edit</Link>
            <Button variant="danger" onClick={handleDelete}>Delete Assignment</Button>
        </div>
    )
    }
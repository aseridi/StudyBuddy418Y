'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Tables } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Pencil, Trash2, Calendar, Flag } from 'lucide-react'
import { getStatusStyle } from '@/lib/assignment-status'

type AssignmentWithCourse = Tables<'assignments'> & {courses: {name: string} | null }

const priorityStyles: Record<string, string> = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-gray-100 text-gray-700',
}

const statusOptions = ['not_started', 'in_progress', 'completed']

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

    if (loading) return <p className="text-gray-500">Loading assignment...</p>
    if (error || !assignment) return <p className="rounded-lg bg-red-50 p-4 text-red-700">Assignment not found</p>

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

    const due = new Date(assignment.due_date)
    const overdue = due < new Date() && assignment.status !== 'completed'
    const priority = assignment.priority ?? 'medium'

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <Link href="/assignments" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> Back to assignments
            </Link>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {/* Title row */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <Link
                            href={`/courses/${assignment.course_id}`}
                            className="text-xs font-medium uppercase tracking-wide text-blue-600 hover:underline"
                        >
                            {assignment.courses?.name ?? 'No course'}
                        </Link>
                        <h1 className="mt-1 text-2xl font-bold text-gray-900">{assignment.title}</h1>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Link
                            href={`/assignments/${id}/edit`}
                            className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Pencil className="h-4 w-4" /> Edit
                        </Link>
                        <Button variant="danger" onClick={handleDelete} leftIcon={<Trash2 className="h-4 w-4" />}>
                            Delete
                        </Button>
                    </div>
                </div>

                {/* Facts */}
                <div className="mt-5 flex flex-wrap gap-3 text-sm">
                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${overdue ? 'bg-red-50 font-medium text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        <Calendar className="h-4 w-4" />
                        {overdue ? 'Overdue: ' : 'Due '}
                        {due.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 capitalize ${priorityStyles[priority] ?? priorityStyles.medium}`}>
                        <Flag className="h-4 w-4" /> {priority} priority
                    </span>
                </div>

                {/* Progress */}
                <div className="mt-6">
                    <p className="mb-2 text-sm font-medium text-gray-700">Progress</p>
                    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                        {statusOptions.map((s) => {
                            const active = (assignment.status ?? 'not_started') === s
                            return (
                                <button
                                    key={s}
                                    onClick={() => handleStatusChange(s)}
                                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
                                        active ? `${getStatusStyle(s).className} shadow-sm` : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {getStatusStyle(s).label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Description */}
                {assignment.description && (
                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <p className="mb-2 text-sm font-medium text-gray-700">Description</p>
                        <p className="whitespace-pre-wrap text-gray-700">{assignment.description}</p>
                    </div>
                )}
            </div>
        </div>
    )
}
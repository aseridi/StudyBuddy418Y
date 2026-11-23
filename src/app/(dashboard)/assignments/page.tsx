'use client'
import {useEffect, useState} from 'react'
import {createClient } from '@/lib/supabase/client'
import type {Tables} from '@/types/database'
import Link from 'next/link'
import { getStatusStyle } from '@/lib/assignment-status'

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

    if (loading) return <p className="text-gray-500">Loading assignments...</p>
    if (error) return <p className="rounded-lg bg-red-50 p-4 text-red-700">Error: {error}</p>

    const now = new Date()

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
                <Link
                    href="/assignments/new"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    + Add assignment
                </Link>
            </div>

            {assignments.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                    <p className="text-gray-600">No assignments yet.</p>
                    <Link href="/assignments/new" className="mt-2 inline-block font-medium text-blue-600 hover:underline">
                        Add your first assignment
                    </Link>
                </div>
            ) : (
                <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    {assignments.map((a) => {
                        const status = getStatusStyle(a.status)
                        const due = new Date(a.due_date)
                        const overdue = due < now && a.status !== 'completed'
                        return (
                            <li key={a.id}>
                                <Link
                                    href={`/assignments/${a.id}`}
                                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50"
                                >
                                    <div className="min-w-0">
                                        <p className={`truncate font-medium ${a.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                                            {a.title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {a.courses?.name ?? 'No course'} ·{' '}
                                            <span className={overdue ? 'font-medium text-red-600' : ''}>
                                                {overdue ? 'Overdue: ' : 'Due '}
                                                {due.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </span>
                                        </p>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}>
                                        {status.label}
                                    </span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
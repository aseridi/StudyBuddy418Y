'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'
import Link from 'next/link'
import { getStatusStyle } from '@/lib/assignment-status';

type DueSoonAssignment = Pick<Tables<'assignments'>, 'id' |'title' | 'due_date' | 'priority' | 'status' > & {
    courses: {name:string} | null
}


function dueLabel(dueDate: string) {
    const msPerDay = 1000 * 60 * 60 * 24
    const days = Math.ceil((new Date(dueDate).getTime() - Date.now()) / msPerDay)
    if (days <= 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    return `In ${days} days`
}

export default function DueSoonList() {

    const [assignments, setAssignments] = useState<DueSoonAssignment[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)




    useEffect(() => {
        async function load() {

            const now = new Date()
            const currentTime = now.toISOString()
            const sevenDaysFromNow = new Date();
            sevenDaysFromNow.setDate(now.getDate() + 7);
            const futureTime = sevenDaysFromNow.toISOString();


            const {data, error} = await createClient()

            .from('assignments')
            .select('id, title, due_date, priority, status, courses(name)')
            .neq('status', 'completed')
            .gte('due_date',currentTime)
            .lte('due_date', futureTime)
            .order('due_date', {ascending: true})

            if(error) {
                setError(error.message)
                setLoading(false)
                return
            }
            setAssignments(data)
            setLoading(false)
        }
        load()
    }, [])

       if (loading) return <p className="text-gray-500">Loading...</p>
    if (error) return <p className="rounded-lg bg-red-50 p-4 text-red-700">Error: {error}</p>

    return (
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
                <h2 className="font-semibold text-gray-900">Due in the next 7 days</h2>
                <span className="text-sm text-gray-500">{assignments.length}</span>
            </div>

            {assignments.length === 0 ? (
                <div className="px-5 py-10 text-center">
                    <p className="text-gray-600">Nothing due in the next 7 days</p>
                    <Link href="/assignments/new" className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline">
                        Add an assignment
                    </Link>
                </div>
            ) : (
                <ul className="divide-y divide-gray-100">
                    {assignments.map((a) => {
                        const label = dueLabel(a.due_date)
                        const urgent = label === 'Today' || label === 'Tomorrow'
                        const status = getStatusStyle(a.status)
                        return (
                            <li key={a.id}>
                                <Link href={`/assignments/${a.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50">
                                    <div className={`w-20 shrink-0 text-sm font-semibold ${urgent ? 'text-red-600' : 'text-gray-500'}`}>
                                        {label}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-gray-900">{a.title}</p>
                                        <p className="text-sm text-gray-500">
                                            {a.courses?.name ?? 'No course'} ·{' '}
                                            {new Date(a.due_date).toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
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
        </section>
    )
}
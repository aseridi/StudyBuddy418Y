'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'
import Link from 'next/link'


type DueSoonAssignment = Pick<Tables<'assignments'>, 'id' |'title' | 'due_date' | 'priority' | 'status' > & {
    courses: {name:string} | null
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

    if(loading) return <p>loading...</p>
    if(error) return <p>Error: {error}</p>
    if(assignments.length ===0) return <div>
        <p>nothing due in the next 7 days.</p>
        <Link href="/assignments/new">Add assignments</Link>
    </div>

    return (
        <div>
            <h2>Upcoming assignments</h2>
            <ul>
                {assignments.map((a) => (
                    <li key = {a.id}>
                        <Link href={`/assignments/${a.id}`}>{a.title}</Link>
                        {`  `}{a.courses?.name}, {` `} due {new Date(a.due_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short'})}, priority {a.priority}
                    </li>
                ))}
            </ul>
            <Link href="/assignments/new">Add assignment</Link>
        </div>
    )

}
'use client'

import { useState, useEffect } from "react"
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { startOfWeek, addDays, isSameDay } from "@/lib/calendar"
import type { Tables } from '@/types/database'
import { CalendarAssignment } from "@/components/calendar/WeekView"
import { WeekView } from "@/components/calendar/WeekView"


export default function CalendarPage() {
    const [assignments, setAssignments] = useState<CalendarAssignment[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading ] = useState(true)
    const [weekStart, setWeekStart ]= useState(() => startOfWeek(new Date()))

    useEffect(() => {
        async function load(){
            setLoading(true)
            setError('')
            const {data, error} = await createClient()
            .from('assignments')
            .select('id, title, due_date, status, courses(name, code)')
            .gte('due_date', weekStart.toISOString())
            .lt('due_date', addDays(weekStart, 7).toISOString())
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
    }, [weekStart])

    return (
        <div>
            <h1>Calendar</h1>
            <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setWeekStart(addDays(weekStart, -7))}>‹</Button>
                <span>
                    {weekStart.toLocaleDateString()} – {addDays(weekStart, 6).toLocaleDateString()}
                </span>
                <Button variant="outline" onClick={() => setWeekStart(addDays(weekStart, 7))}>›</Button>
            </div>          
            {loading ? <p>Loading ....</p>
            :error ? <p> Error: {error}</p>
            :assignments.length ===0? <p>No deadlines this week.</p>
            :<WeekView weekStart={weekStart} assignments={assignments}/>} 
        </div>
    )
}
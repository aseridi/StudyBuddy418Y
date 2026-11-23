'use client'

import { useState, useEffect } from "react"
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { startOfWeek, addDays } from "@/lib/calendar"
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
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" aria-label="Previous week" onClick={() => setWeekStart(addDays(weekStart, -7))}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="min-w-44 text-center text-sm font-medium text-gray-700">
                        {weekStart.toLocaleDateString([], { month: 'short', day: 'numeric' })} – {addDays(weekStart, 6).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <Button variant="outline" size="sm" aria-label="Next week" onClick={() => setWeekStart(addDays(weekStart, 7))}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setWeekStart(startOfWeek(new Date()))}>
                        Today
                    </Button>
                </div>
            </div>

            {loading ? (
                <p className="text-gray-500">Loading deadlines...</p>
            ) : error ? (
                <p className="rounded-lg bg-red-50 p-4 text-red-700">Error: {error}</p>
            ) : assignments.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                    <p className="text-gray-600">No deadlines this week.</p>
                </div>
            ) : (
                <WeekView weekStart={weekStart} assignments={assignments} />
            )}
        </div>
    )
}

'use client'

import { addDays, isSameDay } from "@/lib/calendar"
import type {Tables} from '@/types/database'
import Link from 'next/link'


export type CalendarAssignment = Pick<Tables<'assignments'>, 'id' | 'title' | 'due_date' | 'status' > & {
    courses: {name: string; code: string | null } | null }

interface WeekViewProps {
    weekStart: Date; assignments: CalendarAssignment[]
}


export function WeekView({
    weekStart, assignments,
}: WeekViewProps) {
    const days = [0,1,2,3,4,5,6].map(i=> addDays(weekStart, i))

    return (
        <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
                const dayAssignments = assignments.filter((a) => isSameDay(new Date(a.due_date), day))
                return (
                    <div key={day.toISOString()} className="border round p-2 min-h-32">
                        <h3 className="font-medium">
                            {day.toLocaleDateString([], {weekday:'short', day:'numeric'})}
                        </h3>
                        {dayAssignments.map((a) =>
                        <div key={a.id} className={`mt-2 text-sm border rounded p-1 ${a.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                            <Link href={`/assignments/${a.id}`}>{a.title}</Link>
                            <div>{a.courses?.code ?? a.courses?.name}</div>
                            <div>{new Date(a.due_date).toLocaleTimeString([], {timeStyle:'short'})}</div>
                        </div>)}
                    </div>
                )
            })}
        </div>
    )
}
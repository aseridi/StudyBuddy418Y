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

    const today = new Date()

    return (
        <div className="grid gap-2 sm:grid-cols-7">
            {days.map((day) => {
                const dayAssignments = assignments.filter((a) => isSameDay(new Date(a.due_date), day))
                const isToday = isSameDay(day, today)
                return (
                    <div
                        key={day.toISOString()}
                        className={`rounded-xl border bg-white p-2 shadow-sm sm:min-h-32 ${isToday ? 'border-blue-400 ring-1 ring-blue-400' : 'border-gray-200'}`}
                    >
                        <h3 className={`text-sm font-semibold ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>
                            {day.toLocaleDateString([], {weekday:'short', day:'numeric'})}
                        </h3>
                        {dayAssignments.map((a) => (
                            <Link
                                key={a.id}
                                href={`/assignments/${a.id}`}
                                className={`mt-2 block rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs hover:bg-blue-50 ${a.status === 'completed' ? 'line-through opacity-50' : ''}`}
                            >
                                <p className="font-medium text-gray-900">{a.title}</p>
                                <p className="text-gray-500">{a.courses?.code ?? a.courses?.name}</p>
                                <p className="text-gray-500">{new Date(a.due_date).toLocaleTimeString([], {timeStyle:'short'})}</p>
                            </Link>
                        ))}
                    </div>
                )
            })}
        </div>
    )
}

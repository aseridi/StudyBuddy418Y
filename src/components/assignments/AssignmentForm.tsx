'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { assignmentPriorities } from '@/lib/assignment-priority'
import Link from 'next/link'
import {ArrowLeft } from 'lucide-react'

type Props = { assignment?: Tables<'assignments'> }

function toLocalInput(iso: string) {
  const d = new Date(iso)
  const offsetMs = d.getTimezoneOffset() * 60_000
  return new Date(d.getTime() - offsetMs).toISOString().slice(0, 16)
}

export function AssignmentForm({ assignment }: Props) {
  const [title, setTitle] = useState(assignment?.title ?? '')
  const [priority, setPriority] = useState(assignment?.priority ?? 'medium')
  const [courseId, setCourseId] = useState(assignment?.course_id ?? '')
  const [dueDate, setDueDate] = useState(assignment ? toLocalInput(assignment.due_date) : '')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [courses, setCourses] = useState<Tables<'courses'>[]>([])

  useEffect(() => {
    createClient().from('courses').select('*').order('name')
      .then(({ data }) => setCourses(data ?? []))
  }, [])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const url = assignment ? `/api/assignments/${assignment.id}` : '/api/assignments'
    const method = assignment ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, courseId, priority, dueDate: new Date(dueDate).toISOString() }),
    })
    
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setLoading(false)
      return
    }
    window.location.href = assignment ? `/assignments/${assignment.id}` : '/assignments'
  }

  const backHref = assignment ? `/assignments/${assignment.id}` : '/assignments'
  const selectClass = 'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500'


    return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href={backHref} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          {assignment ? 'Edit assignment' : 'New assignment'}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="title"
            label="Title"
            type="text"
            placeholder="e.g. Milestone 4 report"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
            <select id="course" className={selectClass} value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
              <option value="">Choose a course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="dueDate"
              label="Due date"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <div className="space-y-1">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
              <select id="priority" className={`${selectClass} capitalize`} value={priority} onChange={(e) => setPriority(e.target.value)}>
                {assignmentPriorities.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Link
              href={backHref}
              className="inline-flex h-10 items-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <Button type="submit" isLoading={loading}>
              {assignment ? 'Save changes' : 'Add assignment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Props = { assignment?: Tables<'assignments'> }

export function AssignmentForm({ assignment }: Props) {
  const [title, setTitle] = useState(assignment?.title ?? '')
  const [courseId, setCourseId] = useState(assignment?.course_id ?? '')
  const [dueDate, setDueDate] = useState('')

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
      body: JSON.stringify({ title, courseId, dueDate: new Date(dueDate).toISOString() }),
    })
    
    const json = await res.json()
    if (!res.ok) {
      setError(json.error)
      setLoading(false)
      return
    }
    window.location.href = assignment ? `/assignments/${assignment.id}` : '/assignments'
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border p-8 space-y-4">
      <h1>{assignment ? 'Edit assignment' : 'Create assignment'}</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Assignment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
          <option value="">Choose a course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <Input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        {error && <p>{error}</p>}
        <Button type="submit" isLoading={loading}>
          {assignment ? 'Update assignment' : 'Add assignment'}
        </Button>
      </form>
    </div>
  )
}
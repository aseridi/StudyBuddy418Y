'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Tables } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

type CourseWithAssignments = Tables<'courses'> & { assignments: Tables<'assignments'>[]}

export default function CourseDetailPage() {
  const [course, setCourse] = useState<CourseWithAssignments | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    async function loadCourse() {
      const { data, error } = await createClient()
        .from('courses')
        .select('*, assignments(*)')
        .eq('id', id)
        .order('due_date', {referencedTable: 'assignments'})
        .single()

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      setCourse(data)
      setLoading(false)
    }
    loadCourse()
  }, [id])

  if (loading) return <p>Loading ...</p>
  if (error || !course) return <p>Course not found</p>

  async function handleDelete() {
    if (!confirm(`Delete "${course!.name}"? This also deletes its assignments and materials.`)) return
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('Could not delete course')
      return
    }
    window.location.href = '/courses'
  }

  return (
    <div>
      <Link href="/courses">Back to courses</Link>
      <h1>{course.name}</h1>
      {course.code && <p>Code: {course.code}</p>}
      {course.professor && <p>Professor: {course.professor}</p>}
      {course.description && <p>{course.description}</p>}
      <h2>Assignments</h2>
      {course.assignments.length === 0? (
        <p>No assignments for this course yet.</p>
      ): (
        <ul>
          {course.assignments.map((a) => (
            <li key = {a.id}>
              <Link href={`/assignments/${a.id}`}>{a.title}</Link>
              , due {new Date(a.due_date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
      <Link href={`/courses/${id}/edit`}>Edit</Link>
      <Button variant="danger" onClick={handleDelete}>Delete course</Button>
    </div>
  )
}
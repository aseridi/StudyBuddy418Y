'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Tables } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { UploadMaterialForm } from '@/components/materials/UploadMaterialForm'
import { ArrowLeft, Archive, ArchiveRestore, Pencil, Trash2, Upload } from 'lucide-react'
import { getStatusStyle } from '@/lib/assignment-status'

type MaterialItem = Pick<Tables<'materials'>, 'id' | 'title' | 'material_type' | 'is_processed' | 'processing_error' | 'created_at'>

type CourseWithDetails = Tables<'courses'> & { assignments: Tables<'assignments'>[], materials: MaterialItem[]}


export default function CourseDetailPage() {
  const [course, setCourse] = useState<CourseWithDetails | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { id } = useParams<{ id: string }>()
  const [showUpload, setShowUpload] = useState(false)
  

  useEffect(() => {
    async function loadCourse() {
      const { data, error } = await createClient()
        .from('courses')
        .select('*, assignments(*), materials(id, title, material_type, is_processed, processing_error, created_at)')
        .eq('id', id)
        .order('due_date', {referencedTable: 'assignments'})
        .order('created_at', {referencedTable:'materials', ascending: false})
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

  if (loading) return <p className="text-gray-500">Loading course...</p>
  if (error || !course) return <p className="rounded-lg bg-red-50 p-4 text-red-700">Course not found</p>
  const isActive = course.is_active !== false

  async function handleDelete() {
    if (!confirm(`Delete "${course!.name}"? This also deletes its assignments and materials.`)) return
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('Could not delete course')
      return
    }
    window.location.href = '/courses'
  }

   async function handleArchive() {
      if (!confirm(`${isActive ? 'Archive' : 'Unarchive'} "${course!.name}"?`)) return
      const res = await fetch(`/api/courses/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({isActive: !isActive})
    })

    if(!res.ok) {
      alert('could not update course')
      return
    }

    setCourse((prev) => prev && {...prev, is_active: !isActive})
  }

  function handleUploaded(material: Tables<'materials'>) {
    setShowUpload(false)
    setCourse((prev) => prev && {...prev, materials: [material, ...prev.materials]})
  }

    return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link href="/courses" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" /> Back to courses
      </Link>

      {/* Course header */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="h-2" style={{ backgroundColor: course.color ?? '#2563eb' }} />
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {course.code && (
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{course.code}</p>
            )}
            <h1 className="mt-1 text-2xl font-bold text-gray-900">{course.name}</h1>
            {!isActive && (
              <span className="mt-2 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">Archived</span>
            )}
            {course.professor && <p className="mt-1 text-gray-600">{course.professor}</p>}
            {course.description && <p className="mt-3 max-w-2xl text-sm text-gray-700">{course.description}</p>}
          </div>
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/courses/${id}/edit`}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Pencil className="h-4 w-4" /> Edit
            </Link>
            <Button variant="outline" onClick={handleArchive} leftIcon={isActive ? <Archive className="h-4 w-4" /> : <ArchiveRestore className="h-4 w-4" />}>
              {isActive ? 'Archive' : 'Unarchive'}
            </Button>
            <Button variant="danger" onClick={handleDelete} leftIcon={<Trash2 className="h-4 w-4" />}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Assignments */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
            <h2 className="font-semibold text-gray-900">Assignments</h2>
            <span className="text-sm text-gray-500">{course.assignments.length}</span>
          </div>
          {course.assignments.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-500">No assignments for this course yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {course.assignments.map((a) => {
                const status = getStatusStyle(a.status)
                return (
                  <li key={a.id}>
                    <Link href={`/assignments/${a.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">{a.title}</p>
                        <p className="text-sm text-gray-500">
                          Due {new Date(a.due_date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
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

        {/* Materials */}
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
            <h2 className="font-semibold text-gray-900">Materials</h2>
            <Button size="sm" variant="outline" onClick={() => setShowUpload(!showUpload)} leftIcon={<Upload className="h-4 w-4" />}>
              {showUpload ? 'Cancel' : 'Upload'}
            </Button>
          </div>
          {showUpload && (
            <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
              <UploadMaterialForm courseId={id} onUploaded={handleUploaded} />
            </div>
          )}
          {course.materials.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-500">No materials for this course yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {course.materials.map((m) => (
                <li key={m.id}>
                  <Link href={`/materials/${m.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">{m.title}</p>
                      <p className="text-sm text-gray-500 capitalize">{m.material_type.replace('_', ' ')}</p>
                    </div>
                    {m.processing_error && (
                      <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">No text</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
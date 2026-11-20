'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'
import Link from 'next/link'



type ChatSession = Pick<Tables<'chat_sessions'>, 'id' | 'title' | 'course_id'>  & {
    courses: { name: string, code: string | null } | null
}
type Message = Pick<Tables<'chat_messages'>, 'id' | 'role' | 'content' | 'referenced_materials' | 'created_at'>
type Material = Pick<Tables<'materials'> , 'id' | 'title'>



export default function ChatSessionPage() {

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState<ChatSession | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [materials, setMaterials] = useState<Material[]>([])
    const {id} = useParams<{id: string}>()

    useEffect(()=> {

        async function load() {
            const {data, error} = await createClient()
            .from('chat_sessions')
            .select('id, title, course_id, courses(name, code)')
            .eq('id', id)
            .maybeSingle()

            if(error) {
                setError(error.message)
                setLoading(false)
                return
            }
            if(!data) {
                setError('Chat not found')
                setLoading(false)
                return
            }
            setSession(data)


            const {data: messageData, error: messageError} = await createClient()
            .from('chat_messages')
            .select('id, role, content, referenced_materials, created_at')
            .eq('session_id', id)
            .order('created_at', {ascending: true})

            if(messageError) {
                setError(messageError.message)
                setLoading(false)
                return
            }
            setMessages(messageData ?? [])


            if (data.course_id) {
                const {data: materialData, error: materialError} = await createClient()
                .from('materials')
                .select('id, title')
                .eq('course_id', data.course_id)

                if(materialError) {
                    setError(materialError.message)
                    setLoading(false)
                    return
                }
                setMaterials(materialData)
            }
            setLoading(false)
        }
        load()
    }, [id])

    if(loading) return <p>Loading ...</p>
    if(error) return <p> Error: {error}</p>

        return (
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <div>
                <h1 className="text-xl font-semibold">{session?.title ?? 'Untitled chat'}</h1>
                <p className="text-sm text-gray-500">
                    {session?.courses
                        ? `${session.courses.name}${session.courses.code ? ` (${session.courses.code})` : ''}`
                        : 'Course deleted'}
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {messages.length === 0 && (
                    <p className="text-sm text-gray-500">No messages yet. Ask your first question below.</p>
                )}

                {messages.map((m) => {
                    const sources = (m.referenced_materials ?? [])
                        .map((matId) => materials.find((mat) => mat.id === matId))
                        .filter((mat) => mat !== undefined)

                    return (
                        <div
                            key={m.id}
                            className={m.role === 'user'
                                ? 'ml-auto max-w-[80%] rounded-lg bg-gray-100 p-3'
                                : 'mr-auto max-w-[80%] rounded-lg border p-3'}
                        >
                            <p className="whitespace-pre-wrap">{m.content}</p>

                            {m.role === 'assistant' && sources.length > 0 && (
                                <p className="mt-2 text-sm">
                                    <span className="font-medium">Sources: </span>
                                    {sources.map((mat, i) => (
                                        <span key={mat.id}>
                                            {i > 0 && ', '}
                                            <Link href={`/materials/${mat.id}`} className="underline">
                                                {mat.title}
                                            </Link>
                                        </span>
                                    ))}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
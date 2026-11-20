'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'


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
    const [question, setQuestion] = useState('')
    const [sending, setSending] = useState(false)
    const [sendError, setSendError] = useState('')
    const [failedQuestion, setFailedQuestion] = useState('')
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


    async function sendQuestion(text: string, isRetry: boolean) {
        if (!isRetry) {
            const tempMessage: Message = {
                id: `temp-${Date.now()}`,
                role: 'user',
                content: text,
                referenced_materials: null,
                created_at: null,
            }
            setMessages((prev) => [...prev, tempMessage])
        }

        setSendError('')
        setFailedQuestion('')
        setSending(true)

        try {
            const res = await fetch(`/api/chat/sessions/${id}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: text }),
            })
            const data = await res.json()

            if (!res.ok) {
                setSendError(data.error ?? 'The assistant could not answer. Your question is saved.')
                setFailedQuestion(text)
                return
            }
            setMessages((prev) => [...prev, data.message])
        } catch (err) {
            console.error('send failed', err)
            setSendError('Could not reach the assistant.')
            setFailedQuestion(text)
        } finally {
            setSending(false)
        }
    }

    async function handleSend(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const text = question.trim()
        if (!text) return
        setQuestion('')
        await sendQuestion(text, false)
    }


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
                {sending && (
                    <div className="mr-auto rounded-lg border p-3 text-gray-500">Thinking...</div>
                )}
                {sendError && (
                    <div className="flex items-center gap-3 text-sm text-red-600">
                        <p>{sendError}</p>
                        {failedQuestion && (
                            <Button variant="outline" size="sm" disabled={sending}
                                onClick={() => sendQuestion(failedQuestion, true)}>
                                Retry
                            </Button>
                        )}
                    </div>
                )}
                {materials.length ===0} <p className="text-sm text-gray-500">No materials uploaded for this course, answers only use course and assignment info.</p>
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder='Ask a question'
                        maxLength={2000}
                        className="flex-1 rounded-lg border px-3 py-2"
                        />
                        <Button type="submit" isLoading={sending}>Send</Button>
                </form>
            </div>
        </div>
    )
}
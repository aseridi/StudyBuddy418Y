'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Send } from 'lucide-react'


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


    if(loading) return <p className="text-gray-500">Loading chat...</p>
    if(error) return <p className="rounded-lg bg-red-50 p-4 text-red-700">Error: {error}</p>

    return (
        <div className="mx-auto max-w-3xl space-y-4">
            <Link href="/chat" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4" /> All chats
            </Link>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-5 py-4">
                    <h1 className="text-lg font-semibold text-gray-900">{session?.title ?? 'Untitled chat'}</h1>
                    <p className="text-sm text-gray-500">
                        {session?.courses
                            ? `${session.courses.name}${session.courses.code ? ` (${session.courses.code})` : ''}`
                            : 'Course deleted'}
                    </p>
                </div>

                <div className="flex flex-col gap-3 p-5">
                    {messages.length === 0 && (
                        <p className="py-8 text-center text-sm text-gray-500">No messages yet. Ask your first question below.</p>
                    )}

                    {messages.map((m) => {
                        const sources = (m.referenced_materials ?? [])
                            .map((matId) => materials.find((mat) => mat.id === matId))
                            .filter((mat) => mat !== undefined)

                        return (
                            <div
                                key={m.id}
                                className={m.role === 'user'
                                    ? 'ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2.5 text-white'
                                    : 'mr-auto max-w-[85%] rounded-2xl rounded-bl-sm border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-900'}
                            >
                                <p className="whitespace-pre-wrap">{m.content}</p>

                                {m.role === 'assistant' && sources.length > 0 && (
                                    <p className="mt-2 border-t border-gray-200 pt-2 text-xs text-gray-500">
                                        <span className="font-medium">Sources: </span>
                                        {sources.map((mat, i) => (
                                            <span key={mat.id}>
                                                {i > 0 && ', '}
                                                <Link href={`/materials/${mat.id}`} className="text-blue-600 hover:underline">
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
                        <div className="mr-auto rounded-2xl rounded-bl-sm border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500">
                            Thinking...
                        </div>
                    )}
                    {sendError && (
                        <div className="flex items-center justify-between gap-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            <p>{sendError}</p>
                            {failedQuestion && (
                                <Button variant="outline" size="sm" disabled={sending}
                                    onClick={() => sendQuestion(failedQuestion, true)}>
                                    Retry
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-2 border-t border-gray-200 p-4">
                    {materials.length === 0 && (
                        <p className="text-xs text-gray-500">No materials uploaded for this course, so answers only use course and assignment info.</p>
                    )}
                    <form onSubmit={handleSend} className="flex gap-2">
                        <label htmlFor="question" className="sr-only">Question</label>
                        <input
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask a question about this course"
                            maxLength={2000}
                            className="h-10 flex-1 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button type="submit" isLoading={sending} disabled={!question.trim()} leftIcon={<Send className="h-4 w-4" />}>
                            Send
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/types/database'



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
        <div>
            <h1>{session?.title ?? 'Untitled Chat'}</h1>
            <ul>
                {messages.map((m) =>(
                    <li key={m.id}>{m.role}: {m.content}</li>
                ))}
            </ul>
        </div>
    )
   
}
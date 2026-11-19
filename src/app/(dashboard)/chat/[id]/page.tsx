'use client'
import { useParams } from 'next/navigation'

export default function ChatSessionPage() {
    const { id } = useParams<{ id: string }>()
    return <p>Chat {id}</p>
}
'use client'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
    const {profile} = useAuth()
    return <h1> Welcome, {profile?.full_name || 'Student'}</h1>
}
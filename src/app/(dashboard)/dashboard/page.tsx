'use client'
import { useAuth } from '@/contexts/AuthContext'
import DueSoonList from '@/components/dashboard/DueSoonList'


export default function DashboardPage() {
    const {profile} = useAuth()
    return ( 
        <>
            <h1> Welcome, {profile?.full_name || 'Student'}</h1>
            <DueSoonList />
        </>
    )
}
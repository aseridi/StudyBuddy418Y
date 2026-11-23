'use client'
import { useAuth } from '@/contexts/AuthContext'
import DueSoonList from '@/components/dashboard/DueSoonList'
import Link from 'next/link'
import { Plus, MessageSquare, BookOpen } from 'lucide-react'


export default function DashboardPage() {
    const {profile} = useAuth()

    const firstName = profile?.full_name?.split(' ')[0] || 'Student'
    const today = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })

    const actions = [
        { href: '/assignments/new', label: 'Add assignment', icon: Plus },
        { href: '/courses', label: 'My courses', icon: BookOpen },
        { href: '/chat', label: 'Ask the study assistant', icon: MessageSquare },
    ]

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <div>
                <p className="text-sm text-gray-500">{today}</p>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}</h1>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <DueSoonList />
                </div>

                <section className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-3 font-semibold text-gray-900">Quick actions</h2>
                    <div className="space-y-2">
                        {actions.map((action) => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <action.icon className="h-4 w-4" />
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}
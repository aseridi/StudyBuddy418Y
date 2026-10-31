'use client'; 
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client'
import { useState, Suspense } from 'react'
import Link from 'next/link';


function SignupForm() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setLoading(true)

        const supabase = createClient()
        const {error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {full_name: name},
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })
        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }
        setSent(true)

    }
if (sent) return <p>check your email for confirmation link</p>
    return (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border p-8 space-y-4">
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <input
                type="text"
                placeholder ="full name"
                value = {name}
                onChange={(e) => setName(e.target.value)}
                required/>
                {error && <p>{error}</p>}
                <p className="text-sm text-gray-600"> Already Have an Account?{' '}
                    <Link href="/login" className="text-sm text-blue-600 hover:underline">Bakc to Login</Link>
                </p>
                <Button type="submit" disabled={loading}>
                {loading ? 'Singing Up' : 'Sign Up'}
                </Button>
            </form>
        </div>
    )

}

export default function SignupPage() {
    return (
        <Suspense>
            <SignupForm />
        </Suspense>
        )
}

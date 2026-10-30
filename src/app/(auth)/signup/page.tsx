'use client'; 
import { createClient } from '@/lib/supabase/client'
import { useState, Suspense } from 'react'


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
        <main>
            <p>Sign Up</p>
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
                <button type="submit" disabled={loading}>
                {loading ? 'Singing Up' : 'Sign Up'}
                </button>
            </form>
        </main>
    )

}

export default function SignupPage() {
    return (
        <Suspense>
            <SignupForm />
        </Suspense>
        )
}

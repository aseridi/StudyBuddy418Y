'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [email, setEmail] = useState('')

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setLoading(true)

        const supabase = createClient()

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${location.origin}/auth/callback?next=/update-password`,
        })
        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }
        setSent(true)
        setLoading(false)
    }
    if (sent) return <p>If that email has an account, we sent a reset link.</p>

return (
  <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border p-8 space-y-4">
    <h1>Reset password</h1>
    <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Email" value={email}
        onChange={(e) => setEmail(e.target.value)} required />
      {error && <p>{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send reset link'}
      </Button>
    </form>
    <Link href="/login" className="text-sm text-blue-600 hover:underline">Back to login</Link>
  </div>
)
}

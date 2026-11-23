'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { AlertCircle, MailCheck } from 'lucide-react';

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
    if (sent) return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
        <MailCheck className="h-6 w-6 text-blue-600" />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900">Check your email</h1>
        <p className="mt-2 text-sm text-gray-600">If that email has an account, we sent a link to reset your password.</p>
      </div>
      <p className="text-center text-sm"><Link href="/login" className="font-medium text-blue-600 hover:underline">Back to log in</Link></p>
    </div>
  )

return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reset password</h1>
        <p className="mt-1 text-sm text-gray-500">Enter your email and we&apos;ll send you a reset link.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && (
          <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
          </p>
        )}
        <Button type="submit" isLoading={loading} className="w-full">Send reset link</Button>
      </form>
      <p className="text-center text-sm"><Link href="/login" className="font-medium text-blue-600 hover:underline">Back to log in</Link></p>
    </div>
  )
}

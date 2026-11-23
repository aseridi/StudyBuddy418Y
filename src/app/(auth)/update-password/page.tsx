'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle } from 'lucide-react';


export default function UpdatePassword() {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [password, setPassword] = useState('')



    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setLoading(true)

        const supabase = createClient()

        const { error } = await supabase.auth.updateUser({password})
        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }
        window.location.href ='/dashboard'
    }

return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Choose a new password</h1>
        <p className="mt-1 text-sm text-gray-500">You&apos;ll be taken to your dashboard after saving.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
          </p>
        )}
        <Button type="submit" isLoading={loading} className="w-full">Update password</Button>
      </form>
    </div>
  )
}

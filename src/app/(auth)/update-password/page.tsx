'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';


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
  <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border p-8 space-y-4">
    <h1>Update Password</h1>
    <form onSubmit={handleSubmit}>
        <input type="password" placeholder ="New password" value = {password}
        onChange={(e) => setPassword(e.target.value)} required />
      {error && <p>{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  </div>
)
}

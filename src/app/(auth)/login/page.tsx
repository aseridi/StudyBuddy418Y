'use client'; 

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

function LoginForm() {
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/dashboard'
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('')
        setLoading(true)

        const supabase = createClient();
        const {error} = await supabase.auth.signInWithPassword({email, password})
        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }
        window.location.href = redirectTo 
    }
    return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border p-8 space-y-4">
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Link href="/reset-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
        {error && <p>{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
      <p className ="text-sm text-gray-600"> Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    )
}

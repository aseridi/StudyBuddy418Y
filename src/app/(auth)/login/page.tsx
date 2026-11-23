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
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Log in</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back to StudyBuddy.</p>
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
        <div className="space-y-1">
          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-right">
            <Link href="/reset-password" className="text-sm font-medium text-blue-600 hover:underline">Forgot password?</Link>
          </div>
        </div>
        {error && (
          <p className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
          </p>
        )}
        <Button type="submit" isLoading={loading} className="w-full">Log in</Button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-blue-600 hover:underline">Sign up</Link>
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

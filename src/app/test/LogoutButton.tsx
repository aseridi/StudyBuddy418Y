// src/app/test/LogoutButton.tsx
'use client'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  async function logout() {
    await createClient().auth.signOut()
    window.location.href = '/login'
  }
  return <button onClick={logout}>Log out</button>
}
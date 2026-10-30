import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from './LogoutButton'
export default async function TestPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase.from('courses').select('*')

  return (
    <div>
      <LogoutButton />
    <pre>
      {JSON.stringify({ user, data, error }, null, 2)}
    </pre>
    </div>
  )
}
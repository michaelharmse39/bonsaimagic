import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import ProfileClient from './ProfileClient'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('bm_user_session')?.value
  const user = token ? await verifyToken(token) : null
  if (!user) redirect('/login')

  const { data: addresses } = await supabase
    .from('addresses')
    .select('*')
    .eq('user_email', user.email)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true })

  return (
    <ProfileClient
      user={{ firstName: user.firstName, lastName: user.lastName, email: user.email }}
      addresses={addresses ?? []}
    />
  )
}

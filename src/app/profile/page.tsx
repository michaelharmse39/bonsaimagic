import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Package } from 'lucide-react'
import Link from 'next/link'
import LogoutButton from '@/app/account/LogoutButton'

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('bm_user_session')?.value
  const user = token ? await verifyToken(token) : null

  if (!user) redirect('/login')

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="jp-label mb-1">My Account</p>
          <h1 className="font-(family-name:--font-heading) font-light text-3xl">
            {user.firstName} {user.lastName}
          </h1>
        </div>
        <LogoutButton />
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <User size={14} /> Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Full Name</p>
            <p>{user.firstName} {user.lastName}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Email</p>
            <p className="flex items-center gap-1.5"><Mail size={12} className="text-muted-foreground" />{user.email}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package size={16} className="text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Order History</p>
              <p className="text-xs text-muted-foreground">View all your past orders</p>
            </div>
          </div>
          <Link href="/orders" className="text-xs text-green-600 hover:underline font-medium">
            View Orders →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

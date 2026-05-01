'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Login failed')
        return
      }
      router.push('/account')
      router.refresh()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="jp-label mb-3">Welcome back</p>
        <h1 className="font-(family-name:--font-heading) font-light text-3xl mb-8">Sign In</h1>

        {/* Google Sign In */}
        <a href="/api/auth/google/start">
          <Button variant="outline" className="w-full rounded-none mb-6 gap-3 h-11">
            <FcGoogle size={18} />
            Continue with Google
          </Button>
        </a>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-xs text-muted-foreground uppercase tracking-widest">or</span>
          </div>
        </div>

        {/* Email / Password */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Email address"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <Input
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
          <Button className="w-full rounded-none" type="submit" disabled={loading}>
            {loading ? <><Loader2 size={16} className="animate-spin mr-2" />Signing In...</> : 'Sign In with Email'}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          <Link href="/forgot-password" className="text-foreground hover:underline">Forgot password?</Link>
        </p>
        <p className="text-sm text-muted-foreground mt-3 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-foreground hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

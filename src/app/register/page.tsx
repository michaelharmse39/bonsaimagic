'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [otp, setOtp] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, purpose: 'register' }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to send verification code')
        return
      }
      setOtpToken(data.otpToken)
      setStep('otp')
      toast.success(`Verification code sent to ${form.email}`)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, otp, otpToken }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Registration failed')
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

  async function handleResend() {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, purpose: 'register' }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to resend code')
        return
      }
      setOtpToken(data.otpToken)
      setOtp('')
      toast.success('New code sent — check your inbox')
    } catch {
      toast.error('Failed to resend code')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'otp') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <button
            onClick={() => setStep('form')}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <p className="jp-label mb-3">One more step</p>
          <h1 className="font-(family-name:--font-heading) font-light text-3xl mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground mb-8">
            We sent a 6-digit code to <span className="text-foreground font-medium">{form.email}</span>
          </p>
          <form className="space-y-4" onSubmit={handleVerify}>
            <Input
              type="text"
              placeholder="000000"
              maxLength={6}
              inputMode="numeric"
              className="text-center text-2xl tracking-[0.4em] font-mono h-14"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              autoFocus
            />
            <Button className="w-full rounded-none" type="submit" disabled={loading || otp.length < 6}>
              {loading
                ? <><Loader2 size={16} className="animate-spin mr-2" />Creating account...</>
                : 'Create Account'}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-6 text-center">
            Didn&apos;t receive it?{' '}
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-foreground hover:underline disabled:opacity-50"
            >
              Resend code
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="jp-label mb-3">Create account</p>
        <h1 className="font-(family-name:--font-heading) font-light text-3xl mb-8">Register</h1>

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

        <form className="space-y-4" onSubmit={handleSendOtp}>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="First name"
              required
              value={form.firstName}
              onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
            />
            <Input
              placeholder="Last name"
              required
              value={form.lastName}
              onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
            />
          </div>
          <Input
            type="email"
            placeholder="Email address"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <Input
            type="password"
            placeholder="Password (min. 6 characters)"
            required
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
          <Button className="w-full rounded-none" type="submit" disabled={loading}>
            {loading
              ? <><Loader2 size={16} className="animate-spin mr-2" />Sending code...</>
              : 'Send Verification Code'}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground mt-6 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-foreground hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

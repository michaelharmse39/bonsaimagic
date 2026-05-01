'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose: 'reset' }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Failed to send reset code')
        return
      }
      setOtpToken(data.otpToken)
      setStep('reset')
      toast.success(`Reset code sent to ${email}`)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, otpToken, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Reset failed')
        return
      }
      toast.success('Password updated! Please sign in.')
      router.push('/login')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'reset') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <button
            onClick={() => { setStep('email'); setOtp(''); setOtpToken('') }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={12} /> Back
          </button>
          <p className="jp-label mb-3">Password reset</p>
          <h1 className="font-(family-name:--font-heading) font-light text-3xl mb-2">Check your email</h1>
          <p className="text-sm text-muted-foreground mb-8">
            We sent a 6-digit code to <span className="text-foreground font-medium">{email}</span>
          </p>
          <form className="space-y-4" onSubmit={handleReset}>
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
            <Input
              type="password"
              placeholder="New password (min. 6 characters)"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button className="w-full rounded-none" type="submit" disabled={loading || otp.length < 6}>
              {loading
                ? <><Loader2 size={16} className="animate-spin mr-2" />Resetting password...</>
                : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/login"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={12} /> Back to sign in
        </Link>
        <p className="jp-label mb-3">Forgot password</p>
        <h1 className="font-(family-name:--font-heading) font-light text-3xl mb-2">Reset password</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Enter your email and we&apos;ll send you a 6-digit reset code.
        </p>
        <form className="space-y-4" onSubmit={handleSendOtp}>
          <Input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <Button className="w-full rounded-none" type="submit" disabled={loading}>
            {loading
              ? <><Loader2 size={16} className="animate-spin mr-2" />Sending code...</>
              : 'Send Reset Code'}
          </Button>
        </form>
      </div>
    </div>
  )
}

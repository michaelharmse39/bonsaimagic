'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EnterPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const res = await fetch('/api/enter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-xs">
        <div className="text-center mb-10">
          <span className="font-[family-name:var(--font-heading)] text-7xl font-light text-muted-foreground/15 block mb-8 select-none">錠</span>
          <span className="font-[family-name:var(--font-heading)] text-2xl font-light tracking-[0.15em] text-foreground block">BONSAI</span>
          <span className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[0.3em] text-primary block">MAGIC</span>
          <div className="w-8 h-px bg-border mx-auto mt-6 mb-8" />
          <p className="jp-label">Private Preview</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false) }}
            placeholder="Enter password"
            className="w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-foreground transition-colors"
            required
            autoFocus
          />
          {error && (
            <p className="text-xs text-center" style={{ color: 'oklch(0.55 0.18 25)' }}>
              Incorrect password
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-3 text-xs tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Entering...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}

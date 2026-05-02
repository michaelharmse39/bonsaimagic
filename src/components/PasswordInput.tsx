'use client'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface Props {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
  showStrength?: boolean
  className?: string
}

function getStrength(pw: string) {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  if (score <= 1) return { score: 1, label: 'Weak', textColor: 'text-red-500', barColor: 'bg-red-500' }
  if (score === 2) return { score: 2, label: 'Fair', textColor: 'text-yellow-500', barColor: 'bg-yellow-400' }
  if (score === 3) return { score: 3, label: 'Good', textColor: 'text-green-500', barColor: 'bg-green-400' }
  return { score: 4, label: 'Strong', textColor: 'text-green-600', barColor: 'bg-green-500' }
}

export default function PasswordInput({ value, onChange, placeholder, required, showStrength, className }: Props) {
  const [show, setShow] = useState(false)
  const strength = showStrength && value.length > 0 ? getStrength(value) : null

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pr-10 ${className ?? ''}`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {strength && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.score ? strength.barColor : 'bg-muted'}`}
              />
            ))}
          </div>
          <p className={`text-xs ${strength.textColor}`}>{strength.label}</p>
        </div>
      )}
    </div>
  )
}

import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="jp-label mb-3">Create account</p>
        <h1 className="font-[family-name:var(--font-heading)] font-light text-3xl mb-8">Register</h1>
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="First name" required />
            <Input placeholder="Last name" required />
          </div>
          <Input type="email" placeholder="Email address" required />
          <Input type="password" placeholder="Password" required />
          <Input type="password" placeholder="Confirm password" required />
          <Button className="w-full rounded-none" type="submit">Create Account</Button>
        </form>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-foreground hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="jp-label mb-3">Welcome back</p>
        <h1 className="font-[family-name:var(--font-heading)] font-light text-3xl mb-8">Sign In</h1>
        <form className="space-y-4">
          <Input type="email" placeholder="Email address" required />
          <Input type="password" placeholder="Password" required />
          <Button className="w-full rounded-none" type="submit">Sign In</Button>
        </form>
        <p className="text-sm text-muted-foreground mt-6 text-center">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-foreground hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

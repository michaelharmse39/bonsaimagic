'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function StudioPage() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/studio') {
      router.replace('/studio/structure')
    }
  }, [pathname, router])

  return <NextStudio config={config} />
}

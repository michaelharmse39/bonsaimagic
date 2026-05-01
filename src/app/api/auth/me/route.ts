import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, SESSION_COOKIE } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return NextResponse.json(null)
  const user = await verifyToken(token)
  if (!user) return NextResponse.json(null)
  return NextResponse.json({ userId: user.userId, email: user.email, firstName: user.firstName, lastName: user.lastName })
}

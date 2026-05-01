import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'bm-fallback-secret-change-in-prod')

export const hashPassword = (p: string) => bcrypt.hash(p, 10)
export const verifyPassword = (p: string, hash: string) => bcrypt.compare(p, hash)

export interface SessionUser {
  userId: string
  email: string
  firstName: string
  lastName: string
}

export async function signToken(payload: SessionUser): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(secret())
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export const SESSION_COOKIE = 'bm_user_session'

export const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 30,
  path: '/',
  sameSite: 'lax' as const,
}

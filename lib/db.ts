// lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';

const alg = 'HS256';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET ausente');
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: JWTPayload) {
  const secret = getSecret();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifySession(token: string) {
  const secret = getSecret();
  const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] });
  return payload;
}

export const cookieName = 'session';
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
};

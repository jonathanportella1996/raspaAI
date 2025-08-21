// app/api/ping/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  return new Response('pong', { status: 200 });
}

// ⚠️ TEMPORÁRIO: usar /api/ping também para login admin
export async function POST(req: Request) {
  const ADMIN_DASH_PASSWORD = process.env.ADMIN_DASH_PASSWORD;
  const { password } = await req.json().catch(() => ({}));

  if (!ADMIN_DASH_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'env_missing' }, { status: 500 });
  }
  if (!password || String(password).trim() !== String(ADMIN_DASH_PASSWORD).trim()) {
    return NextResponse.json({ ok: false, error: 'invalid_password' }, { status: 401 });
  }

  cookies().set('raspa_admin', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8h
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().delete('raspa_admin');
  return NextResponse.json({ ok: true });
}

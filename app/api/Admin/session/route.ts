import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_DASH_PASSWORD = process.env.ADMIN_DASH_PASSWORD!;

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  if (!password || password !== ADMIN_DASH_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'invalid_password' }, { status: 401 });
  }
  cookies().set('raspa_admin', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 8, // 8h
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().delete('raspa_admin');
  return NextResponse.json({ ok: true });
}

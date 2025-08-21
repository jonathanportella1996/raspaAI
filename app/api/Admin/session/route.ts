// app/api/admin/session/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const ADMIN_DASH_PASSWORD = process.env.ADMIN_DASH_PASSWORD;

// GET só para debug no deploy (depois pode apagar)
export async function GET() {
  const has = !!ADMIN_DASH_PASSWORD;
  return NextResponse.json({ ok: true, hasAdminPwd: has }, { status: 200 });
}

export async function POST(req: Request) {
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
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  cookies().delete('raspa_admin');
  return NextResponse.json({ ok: true });
}

// app/api/reveal/route.ts
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

function randomId(len = 24) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: Request) {
  try {
    const h = headers();
    const { slug } = await req.json().catch(() => ({}));
    if (!slug) return NextResponse.json({ ok: false, error: 'slug-required' }, { status: 400 });

    // cookie de sessão anônima
    const cookieStore = cookies();
    let sessionId = cookieStore.get('raspa_session')?.value;
    if (!sessionId) {
      sessionId = randomId();
      cookieStore.set('raspa_session', sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 ano
      });
    }

    // metadados básicos
    const ip =
      h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      h.get('x-real-ip') ||
      '0.0.0.0';
    const userAgent = h.get('user-agent') || 'unknown';

    // inserção via REST do Supabase (RLS: apenas INSERT liberado)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reveals`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',          // retorna a linha criada
      },
      body: JSON.stringify([{ slug, session_id: sessionId, ip, user_agent: userAgent }]),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ ok: false, error: 'db-insert-failed', details: err }, { status: 500 });
    }

    const [row] = await res.json();
    return NextResponse.json({ ok: true, id: row?.id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: 'unexpected', details: String(e?.message || e) }, { status: 500 });
  }
}

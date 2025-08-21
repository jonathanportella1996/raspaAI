import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;

export async function GET(req: Request) {
  const isAdmin = cookies().get('raspa_admin')?.value === '1';
  if (!isAdmin) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug') ?? '';
  const limit = Math.min(Number(url.searchParams.get('limit') ?? '100'), 500);

  const query = new URLSearchParams();
  query.set('select', 'id,slug,session_id,ip,user_agent,revealed_at,user_id');
  if (slug) query.set('slug', `eq.${slug}`);
  query.set('order', 'revealed_at.desc');
  query.set('limit', String(limit));

  const res = await fetch(`${SUPABASE_URL}/rest/v1/reveals?${query.toString()}`, {
    headers: {
      apikey: SUPABASE_SERVICE_ROLE,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const txt = await res.text();
    return NextResponse.json({ ok: false, error: 'db_error', details: txt }, { status: 500 });
  }

  const rows = await res.json();
  return NextResponse.json({ ok: true, rows });
}

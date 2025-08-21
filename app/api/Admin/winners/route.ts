import { NextResponse } from 'next/server';
import { requireAdmin } from '../../_adminCheck';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SR  = process.env.SUPABASE_SERVICE_ROLE!;

export async function GET(req: Request) {
  try {
    requireAdmin();
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug') ?? '';
    const qs = new URLSearchParams();
    qs.set('select', 'id,slug,session_id,user_id,revealed_at,redeemed_at,notes,prize:prize_id(id,code,value_cents)');
    if (slug) qs.set('slug', `eq.${slug}`);
    qs.set('order', 'revealed_at.desc'); qs.set('limit', '500');

    const res = await fetch(`${URL}/rest/v1/winners?${qs.toString()}`, {
      headers: { apikey: SR, Authorization: `Bearer ${SR}` }, cache:'no-store'
    });
    const rows = await res.json();
    return NextResponse.json({ ok: true, rows });
  } catch {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
}

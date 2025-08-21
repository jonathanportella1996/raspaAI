import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../_app_disabled/api/_adminCheck';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SR  = process.env.SUPABASE_SERVICE_ROLE!;

export async function GET() {
  try {
    requireAdmin();

    // total gasto (soma) — usando RPC agregador ou query simples:
    const totalRes = await fetch(`${URL}/rest/v1/purchases?select=amount_cents`, {
      headers: { apikey: SR, Authorization: `Bearer ${SR}` }, cache:'no-store'
    });
    const purchases = await totalRes.json();
    const total = purchases.reduce((s: number, p: any) => s + (p.amount_cents || 0), 0);

    // contadores
    const [wRes, rRes] = await Promise.all([
      fetch(`${URL}/rest/v1/winners?select=id`, { headers: { apikey: SR, Authorization: `Bearer ${SR}` } }),
      fetch(`${URL}/rest/v1/reveals?select=id`, { headers: { apikey: SR, Authorization: `Bearer ${SR}` } })
    ]);
    const winners = await wRes.json();
    const reveals = await rRes.json();

    return NextResponse.json({ ok: true, total_cents: total, winners_count: winners.length, reveals_count: reveals.length });
  } catch {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
}

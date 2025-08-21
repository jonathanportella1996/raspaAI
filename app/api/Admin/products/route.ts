import { NextResponse } from 'next/server';
import { requireAdmin } from '../../_adminCheck';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SR  = process.env.SUPABASE_SERVICE_ROLE!;

export async function GET() {
  try {
    requireAdmin();
    const res = await fetch(`${URL}/rest/v1/products?select=*&order=created_at.desc`, {
      headers: { apikey: SR, Authorization: `Bearer ${SR}` },
      cache: 'no-store',
    });
    const rows = await res.json();
    return NextResponse.json({ ok: true, rows });
  } catch {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    requireAdmin();
    const body = await req.json();
    const toInsert = [{ name: body.name, price_cents: body.price_cents, active: !!body.active }];
    const res = await fetch(`${URL}/rest/v1/products`, {
      method: 'POST',
      headers: {
        apikey: SR, Authorization: `Bearer ${SR}`,
        'Content-Type': 'application/json', Prefer: 'return=representation'
      },
      body: JSON.stringify(toInsert)
    });
    const [row] = await res.json();
    return NextResponse.json({ ok: true, row });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e.message || 'error' }, { status: 400 });
  }
}

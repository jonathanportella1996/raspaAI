import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../_app_disabled/api/_adminCheck';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SR  = process.env.SUPABASE_SERVICE_ROLE!;

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    const res = await fetch(`${URL}/rest/v1/products?id=eq.${params.id}`, {
      method: 'PATCH',
      headers: {
        apikey: SR, Authorization: `Bearer ${SR}`,
        'Content-Type': 'application/json', Prefer: 'return=representation'
      },
      body: await _.text()
    });
    const [row] = await res.json();
    return NextResponse.json({ ok: true, row });
  } catch {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    const res = await fetch(`${URL}/rest/v1/products?id=eq.${params.id}`, {
      method: 'DELETE',
      headers: { apikey: SR, Authorization: `Bearer ${SR}` }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
}

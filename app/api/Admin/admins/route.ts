import { NextResponse } from 'next/server';
import { requireAdmin } from '../_adminCheck';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SR  = process.env.SUPABASE_SERVICE_ROLE!;

export async function GET() {
  try {
    requireAdmin();
    const res = await fetch(`${URL}/rest/v1/admin_users?select=*&order=created_at.desc`, {
      headers: { apikey: SR, Authorization: `Bearer ${SR}` }, cache:'no-store'
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
    const { email, role } = await req.json();
    const res = await fetch(`${URL}/rest/v1/admin_users`, {
      method: 'POST',
      headers: {
        apikey: SR, Authorization: `Bearer ${SR}`,
        'Content-Type': 'application/json', Prefer: 'return=representation'
      },
      body: JSON.stringify([{ email, role: role ?? 'admin', active: true }])
    });
    const [row] = await res.json();
    return NextResponse.json({ ok: true, row });
  } catch {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
}

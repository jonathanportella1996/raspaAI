import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const body = await req.text().catch(() => '{}');
  const { slug } = JSON.parse(body || '{}');
  return NextResponse.json({ ok: true, slug });
}

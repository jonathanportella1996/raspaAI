import { NextResponse } from 'next/server';

export async function GET() {
  const pwd = process.env.ADMIN_DASH_PASSWORD ?? '';
  return NextResponse.json({
    hasAdminPwd: !!pwd,
    length: pwd.length,
    preview: pwd ? `${pwd.slice(0,1)}***${pwd.slice(-1)}` : null,
    nodeEnv: process.env.NODE_ENV,
  });
}

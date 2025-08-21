// middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'], // protege tudo em /admin
};

export function middleware(req: NextRequest) {
  const pwd = process.env.ADMIN_DASH_PASSWORD;
  if (!pwd) {
    return new NextResponse('env_missing: ADMIN_DASH_PASSWORD', { status: 500 });
  }

  // já autenticado por cookie?
  if (req.cookies.get('raspa_admin')?.value === '1') {
    return NextResponse.next();
  }

  const auth = req.headers.get('authorization') || '';
  const expectedRealm = 'Basic realm="RaspaAI Admin"';

  // se não mandou Authorization, pede credenciais (mostra prompt nativo do navegador)
  if (!auth.startsWith('Basic ')) {
    return new NextResponse('Auth required', {
      status: 401,
      headers: { 'WWW-Authenticate': expectedRealm },
    });
  }

  // decodifica Basic base64 -> "username:password"
  const base64 = auth.split(' ')[1] || '';
  let user = '';
  let pass = '';
  try {
    const decoded = Buffer.from(base64, 'base64').toString('utf8');
    [user, pass] = decoded.split(':');
  } catch {
    // força novo prompt
    return new NextResponse('Bad auth header', {
      status: 401,
      headers: { 'WWW-Authenticate': expectedRealm },
    });
  }

  // valida: user fixo "admin" e senha da env
  if (user !== 'admin' || pass !== pwd) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': expectedRealm },
    });
  }

  // ok -> emite cookie para suas rotas/admin já existentes
  const res = NextResponse.next();
  res.cookies.set('raspa_admin', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8, // 8h
  });
  return res;
}

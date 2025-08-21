// pages/api/admin-session.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const ADMIN_DASH_PASSWORD = process.env.ADMIN_DASH_PASSWORD;

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, hasAdminPwd: !!ADMIN_DASH_PASSWORD });
  }

  if (req.method === 'POST') {
    try {
      if (!ADMIN_DASH_PASSWORD) {
        return res.status(500).json({ ok: false, error: 'env_missing' });
      }

      const { password } = req.body || {};
      if (!password || String(password).trim() !== String(ADMIN_DASH_PASSWORD).trim()) {
        return res.status(401).json({ ok: false, error: 'invalid_password' });
      }

      // define cookie de admin (8h)
      res.setHeader('Set-Cookie', serialize('raspa_admin', '1', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 8,
      }));

      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ ok: false, error: 'unexpected' });
    }
  }

  // outros métodos
  return res.status(405).json({ ok: false, error: 'method_not_allowed' });
}

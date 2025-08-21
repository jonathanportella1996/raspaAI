import type { NextApiRequest, NextApiResponse } from 'next';
import { cookieName } from '../../lib/auth';
import { serialize } from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Set-Cookie', serialize(cookieName, '', {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    path: '/', sameSite: 'lax', maxAge: 0,
  }));
  return res.status(200).json({ ok: true });
}

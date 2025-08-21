import type { NextApiRequest, NextApiResponse } from 'next';
import { cookieName, verifySession } from '../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.[cookieName];
  if (!token) return res.status(401).json({ authenticated: false });

  try {
    const payload = await verifySession(token);
    return res.status(200).json({ authenticated: true, user: payload });
  } catch {
    return res.status(401).json({ authenticated: false });
  }
}

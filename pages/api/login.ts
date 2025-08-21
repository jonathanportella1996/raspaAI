import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/db';
import bcrypt from 'bcryptjs';
import { createSession, cookieName, cookieOptions } from '../../lib/auth';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { username, password } = body || {};
  if (!username || !password) return res.status(400).json({ error: 'Credenciais ausentes' });

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id, username, name, password_hash')
    .eq('username', username)
    .maybeSingle();

  if (error) return res.status(500).json({ error: 'Erro ao buscar usuário' });
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });

  const token = await createSession({ sub: user.id, username: user.username, name: user.name, role: 'user' });
  res.setHeader('Set-Cookie', serialize(cookieName, token, { ...cookieOptions }));

  return res.status(200).json({ ok: true });
}

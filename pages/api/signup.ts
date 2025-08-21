import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { username, name, password } = body || {};

  if (!username || !name || !password) {
    return res.status(400).json({ error: 'Campos obrigatórios: username, name, password' });
  }

  // validações simples
  if (String(username).length < 3) return res.status(400).json({ error: 'Username muito curto' });
  if (String(password).length < 6) return res.status(400).json({ error: 'Senha muito curta' });

  // username único
  const { data: exists, error: e1 } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle();

  if (e1) return res.status(500).json({ error: 'Erro ao verificar usuário' });
  if (exists) return res.status(409).json({ error: 'Username já existe' });

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({ username, name, password_hash })
    .select('id, username, name')
    .single();

  if (error) return res.status(500).json({ error: 'Erro ao criar usuário' });

  return res.status(201).json({ user: data });
}

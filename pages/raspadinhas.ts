import type { NextApiRequest, NextApiResponse } from 'next';
import { cookieName, verifySession } from '../../lib/auth';
import { supabaseAdmin } from '../../lib/db';

async function getUserId(req: NextApiRequest) {
  const token = req.cookies?.[cookieName];
  if (!token) throw new Error('no-auth');
  const payload: any = await verifySession(token);
  return String(payload.sub);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const userId = await getUserId(req);

    if (req.method === 'GET') {
      const { data, error } = await supabaseAdmin
        .from('raspadinhas')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) return res.status(500).json({ error: 'Erro ao listar' });
      return res.status(200).json({ items: data, total: data?.length ?? 0 });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { title, prize_cents = 0 } = body || {};
      if (!title) return res.status(400).json({ error: 'title é obrigatório' });

      const { data, error } = await supabaseAdmin
        .from('raspadinhas')
        .insert({ user_id: userId, title, prize_cents, status: 'new' })
        .select('*')
        .single();

      if (error) return res.status(500).json({ error: 'Erro ao criar' });
      return res.status(201).json(data);
    }

    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, status } = body || {};
      if (!id || !status) return res.status(400).json({ error: 'id e status são obrigatórios' });

      // garante que a raspadinha é do usuário
      const { data: owned, error: e1 } = await supabaseAdmin
        .from('raspadinhas')
        .select('id')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (e1) return res.status(500).json({ error: 'Erro ao verificar' });
      if (!owned) return res.status(404).json({ error: 'Não encontrada' });

      const { data, error } = await supabaseAdmin
        .from('raspadinhas')
        .update({ status })
        .eq('id', id)
        .select('*')
        .single();

      if (error) return res.status(500).json({ error: 'Erro ao atualizar' });
      return res.status(200).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

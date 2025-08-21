'use client';

import { useEffect, useState } from 'react';

type Reveal = {
  id: string;
  slug: string | null;
  session_id: string | null;
  ip: string | null;
  user_agent: string | null;
  revealed_at: string;
  user_id: string | null;
};

export default function AdminRevealsPage() {
  const [slug, setSlug] = useState('');
  const [rows, setRows] = useState<Reveal[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true); setErr(null);
      const qs = new URLSearchParams();
      if (slug) qs.set('slug', slug);
      const res = await fetch(`/api/admin/reveals?${qs.toString()}`, { cache: 'no-store' });
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/admin/login';
          return;
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.details || data?.error || 'Erro ao buscar reveals');
      }
      const data = await res.json();
      setRows(data.rows || []);
    } catch (e: any) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    await fetch('/api/admin/session', { method: 'DELETE' });
    window.location.href = '/admin/login';
  };

  return (
    <main className="px-4 py-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Revelações (reveals)</h1>
        <button onClick={logout} className="text-sm underline">Sair</button>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Filtrar por slug (ex: demo)"
          className="w-full sm:w-64 rounded-xl border border-input bg-background px-4 py-2 text-sm"
        />
        <button
          onClick={fetchData}
          className="sm:w-auto rounded-xl px-4 py-2 text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition"
        >
          Buscar
        </button>
      </div>

      {loading ? (
        <div className="mt-6 text-sm text-muted-foreground">Carregando...</div>
      ) : err ? (
        <div className="mt-6 text-sm text-rose-600">{err}</div>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="py-2 pr-3">Quando</th>
                <th className="py-2 pr-3">Slug</th>
                <th className="py-2 pr-3">Session</th>
                <th className="py-2 pr-3">IP</th>
                <th className="py-2 pr-3">User Agent</th>
                <th className="py-2 pr-3">User ID</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60">
                  <td className="py-2 pr-3">{new Date(r.revealed_at).toLocaleString()}</td>
                  <td className="py-2 pr-3">{r.slug ?? '-'}</td>
                  <td className="py-2 pr-3">{r.session_id?.slice(0, 10) ?? '-'}</td>
                  <td className="py-2 pr-3">{r.ip ?? '-'}</td>
                  <td className="py-2 pr-3 truncate max-w-[260px]">{r.user_agent ?? '-'}</td>
                  <td className="py-2 pr-3">{r.user_id ?? '-'}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-muted-foreground">Sem dados para mostrar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

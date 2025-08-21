'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const r = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null);
    const res = await fetch('/api/admin/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setErr('Senha inválida');
      return;
    }
    r.push('/admin/reveals');
  };

  return (
    <main className="min-h-dvh flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border border-border rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-bold">Login Admin</h1>
        <input
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          placeholder="Senha do painel"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {err && <div className="text-sm text-rose-600">{err}</div>}
        <button
          disabled={loading}
          className="w-full rounded-xl px-4 py-3 text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}

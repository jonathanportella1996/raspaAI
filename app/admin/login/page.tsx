'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const r = useRouter();
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null);

    const toSend = pwd.trim();                 // ✅ remove espaços
    console.log('[login] bodyLen:', toSend.length);

    try {
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data?.error === 'env_missing' ? 'ADMIN_DASH_PASSWORD ausente no servidor' : 'Senha inválida');
        return;
      }
      r.push('/admin/reveals');
    } catch {
      setErr('Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm border border-border rounded-2xl p-6 space-y-4">
        <h1 className="text-xl font-bold">Login Admin</h1>
        <input
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
          placeholder="Senha do painel"
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
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

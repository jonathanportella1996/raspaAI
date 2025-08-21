import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [username, setUser] = useState('');
  const [password, setPass] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) router.push('/admin');
    else setErr((await res.json()).error || 'Falha no login');
  }

  return (
    <main style={{ maxWidth: 360, margin: '48px auto', fontFamily: 'system-ui' }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Username" value={username} onChange={(e) => setUser(e.target.value)} />
        <input placeholder="Senha" type="password" value={password} onChange={(e) => setPass(e.target.value)} />
        <button type="submit">Entrar</button>
        {err && <p style={{ color: 'crimson' }}>{err}</p>}
      </form>
      <p style={{ marginTop: 12 }}>
        Não tem conta? <a href="/signup">Criar conta</a>
      </p>
    </main>
  );
}

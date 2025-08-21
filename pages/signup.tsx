import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [username, setUser] = useState('');
  const [password, setPass] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password }),
    });
    if (res.ok) router.push('/login');
    else setErr((await res.json()).error || 'Falha no cadastro');
  }

  return (
    <main style={{ maxWidth: 360, margin: '48px auto', fontFamily: 'system-ui' }}>
      <h1>Criar conta</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Username" value={username} onChange={(e) => setUser(e.target.value)} />
        <input placeholder="Senha" type="password" value={password} onChange={(e) => setPass(e.target.value)} />
        <button type="submit">Cadastrar</button>
        {err && <p style={{ color: 'crimson' }}>{err}</p>}
      </form>
      <p style={{ marginTop: 12 }}>
        Já tem conta? <a href="/login">Entrar</a>
      </p>
    </main>
  );
}

import type { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';

type User = { sub: string; username: string; name: string; role: string };
type Props = { user: User };
type Raspadinha = { id: string; title: string; status: string; prize_cents: number };

export default function AdminHome({ user }: Props) {
  const [items, setItems] = useState<Raspadinha[]>([]);
  const [title, setTitle] = useState('');
  const [prize, setPrize] = useState(0);

  async function load() {
    const res = await fetch('/api/raspadinhas');
    const json = await res.json();
    setItems(json.items || []);
  }

  useEffect(() => { load(); }, []);

  async function createOne() {
    if (!title) return;
    const res = await fetch('/api/raspadinhas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, prize_cents: Number(prize) || 0 }),
    });
    if (res.ok) { setTitle(''); setPrize(0); load(); }
    else alert((await res.json()).error || 'Erro ao criar');
  }

  async function logout() {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <main style={{ maxWidth: 860, margin: '24px auto', fontFamily: 'system-ui' }}>
      <h1>Painel</h1>
      <p>Bem-vindo, <b>{user.name}</b> (@{user.username})</p>
      <button onClick={logout}>Sair</button>

      <section style={{ marginTop: 24 }}>
        <h2>Nova raspadinha</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input placeholder="Prêmio (centavos)" type="number" value={prize} onChange={(e) => setPrize(Number(e.target.value))} />
          <button onClick={createOne}>Criar</button>
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Minhas raspadinhas</h2>
        <ul>
          {items.map((r) => (
            <li key={r.id}>
              <b>{r.title}</b> — status: {r.status} — prêmio: R$ {(r.prize_cents/100).toFixed(2)}
            </li>
          ))}
          {items.length === 0 && <p>Nenhuma ainda.</p>}
        </ul>
      </section>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const cookie = req.headers.cookie || '';
  const r = await fetch(`${base}/api/admin-session`, { headers: { cookie } });
  if (r.status !== 200) return { redirect: { destination: '/login', permanent: false } };
  const data = await r.json();
  return { props: { user: data.user } };
};

'use client';

import { useEffect, useState } from 'react';

type Product = { id:string; name:string; price_cents:number; active:boolean; created_at:string };

export default function AdminProductsPage() {
  const [rows, setRows] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);

  const load = async () => {
    setLoading(true); setErr(null);
    const r = await fetch('/api/admin/products'); 
    if (!r.ok) { setErr('Sem permissão'); setLoading(false); return; }
    const j = await r.json(); setRows(j.rows||[]); setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    const r = await fetch('/api/admin/products', {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ name, price_cents: Math.round(Number(price)||0), active:true })
    });
    if (r.ok) { setName(''); setPrice(0); load(); }
  };

  return (
    <main className="px-4 py-6">
      <h1 className="text-2xl font-bold">Produtos</h1>
      <div className="mt-4 flex gap-2">
        <input className="border rounded px-3 py-2" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Preço (centavos)" type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} />
        <button onClick={create} className="rounded px-4 py-2 bg-emerald-500 text-white">Salvar</button>
      </div>

      {loading ? <p className="mt-6 text-sm text-muted-foreground">Carregando…</p> :
        err ? <p className="mt-6 text-sm text-rose-600">{err}</p> :
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-[720px] w-full text-sm">
            <thead><tr className="border-b">
              <th className="py-2 pr-3">Nome</th>
              <th className="py-2 pr-3">Preço</th>
              <th className="py-2 pr-3">Ativo</th>
              <th className="py-2 pr-3">Criado</th>
            </tr></thead>
            <tbody>
              {rows.map(p=>(
                <tr key={p.id} className="border-b">
                  <td className="py-2 pr-3">{p.name}</td>
                  <td className="py-2 pr-3">R$ {(p.price_cents/100).toFixed(2)}</td>
                  <td className="py-2 pr-3">{p.active ? 'Sim' : 'Não'}</td>
                  <td className="py-2 pr-3">{new Date(p.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {rows.length===0 && <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Nenhum produto.</td></tr>}
            </tbody>
          </table>
        </div>
      }
    </main>
  );
}

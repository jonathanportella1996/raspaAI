'use client';
import { useEffect, useState } from 'react';

type Row = { id:string; slug:string; session_id:string|null; user_id:string|null; revealed_at:string; redeemed_at:string|null; prize?:{ id:string; code:string|null; value_cents:number|null }};

export default function WinnersPage(){
  const [slug, setSlug] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const qs = new URLSearchParams(); if(slug) qs.set('slug', slug);
    const r = await fetch('/api/admin/winners?'+qs.toString());
    const j = await r.json(); setRows(j.rows||[]); setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  return (
    <main className="px-4 py-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Premiados</h1>
        <input className="border rounded px-3 py-2" placeholder="Filtrar slug (ex: demo)" value={slug} onChange={e=>setSlug(e.target.value)} />
        <button onClick={load} className="rounded px-4 py-2 bg-emerald-500 text-white">Buscar</button>
      </div>
      {loading ? <p className="mt-6 text-sm text-muted-foreground">Carregando…</p> :
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-[880px] w-full text-sm">
            <thead><tr className="border-b"><th className="py-2 pr-3">Quando</th><th className="py-2 pr-3">Slug</th><th className="py-2 pr-3">Prize</th><th className="py-2 pr-3">Valor</th><th className="py-2 pr-3">Session</th><th className="py-2 pr-3">User</th><th className="py-2 pr-3">Resgatado</th></tr></thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id} className="border-b">
                  <td className="py-2 pr-3">{new Date(r.revealed_at).toLocaleString()}</td>
                  <td className="py-2 pr-3">{r.slug}</td>
                  <td className="py-2 pr-3">{r.prize?.code ?? '-'}</td>
                  <td className="py-2 pr-3">{r.prize?.value_cents ? `R$ ${(r.prize.value_cents/100).toFixed(2)}` : '-'}</td>
                  <td className="py-2 pr-3">{r.session_id?.slice(0,10) ?? '-'}</td>
                  <td className="py-2 pr-3">{r.user_id ?? '-'}</td>
                  <td className="py-2 pr-3">{r.redeemed_at ? new Date(r.redeemed_at).toLocaleString() : '—'}</td>
                </tr>
              ))}
              {rows.length===0 && <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">Sem dados.</td></tr>}
            </tbody>
          </table>
        </div>}
    </main>
  );
}

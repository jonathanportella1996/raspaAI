'use client';
import { useEffect, useState } from 'react';

export default function MetricsPage(){
  const [data,setData]=useState<{total_cents:number; winners_count:number; reveals_count:number}|null>(null);

  useEffect(()=>{ (async()=>{
    const r = await fetch('/api/admin/metrics');
    const j = await r.json();
    setData(j.ok ? j : null);
  })(); },[]);

  return (
    <main className="px-4 py-6">
      <h1 className="text-2xl font-bold">Visão geral</h1>
      {!data ? <p className="mt-4 text-sm text-muted-foreground">Carregando…</p> :
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="border rounded-xl p-4"><div className="text-sm text-muted-foreground">Faturamento</div><div className="text-2xl font-bold">R$ {(data.total_cents/100).toFixed(2)}</div></div>
        <div className="border rounded-xl p-4"><div className="text-sm text-muted-foreground">Premiados</div><div className="text-2xl font-bold">{data.winners_count}</div></div>
        <div className="border rounded-xl p-4"><div className="text-sm text-muted-foreground">Revelações</div><div className="text-2xl font-bold">{data.reveals_count}</div></div>
      </div>}
    </main>
  );
}

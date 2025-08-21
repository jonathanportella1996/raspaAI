'use client';
import { useEffect, useState } from 'react';

type AdminUser = { id:string; email:string; role:string; active:boolean; created_at:string };

export default function AdminUsersPage(){
  const [rows,setRows]=useState<AdminUser[]>([]);
  const [email,setEmail]=useState('');
  const [role,setRole]=useState('admin');

  const load = async()=>{ const r=await fetch('/api/admin/admins'); const j=await r.json(); setRows(j.rows||[]); };
  useEffect(()=>{ load(); },[]);

  const add = async()=>{
    const r = await fetch('/api/admin/admins',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, role }) });
    if(r.ok){ setEmail(''); setRole('admin'); load(); }
  };

  return (
    <main className="px-4 py-6">
      <h1 className="text-2xl font-bold">Admins</h1>
      <div className="mt-4 flex gap-2">
        <input className="border rounded px-3 py-2" placeholder="email@dominio.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <select className="border rounded px-3 py-2" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="admin">admin</option><option value="viewer">viewer</option>
        </select>
        <button onClick={add} className="rounded px-4 py-2 bg-emerald-500 text-white">Adicionar</button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead><tr className="border-b"><th className="py-2 pr-3">Email</th><th className="py-2 pr-3">Role</th><th className="py-2 pr-3">Ativo</th><th className="py-2 pr-3">Criado</th></tr></thead>
          <tbody>
            {rows.map(u=>(
              <tr key={u.id} className="border-b">
                <td className="py-2 pr-3">{u.email}</td>
                <td className="py-2 pr-3">{u.role}</td>
                <td className="py-2 pr-3">{u.active?'Sim':'Não'}</td>
                <td className="py-2 pr-3">{new Date(u.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {rows.length===0 && <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">Nenhum admin.</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}

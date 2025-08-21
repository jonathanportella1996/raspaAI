import { cookies } from 'next/headers';

export function requireAdmin() {
  const isAdmin = cookies().get('raspa_admin')?.value === '1';
  if (!isAdmin) throw new Error('unauthorized');
}

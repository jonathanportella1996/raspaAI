// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,         // definido no .env.local
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,    // definido no .env.local
  { auth: { persistSession: true, autoRefreshToken: true } }
);

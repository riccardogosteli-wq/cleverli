import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Lazy singleton — only instantiated when actually used (avoids SSR crash on missing env vars)
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!_client) {
    _client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "cleverli_supabase_session",
      },
    });
  }
  return _client;
}

// ⚠️ REMOVED module-level export to defer initialization
// Use getSupabase() or getSupabaseClient() instead
// This prevents Supabase client from being instantiated at module load time

export type { User, Session } from "@supabase/supabase-js";

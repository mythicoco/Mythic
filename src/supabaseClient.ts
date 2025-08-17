import { createClient } from "@supabase/supabase-js";

const env = (k: "VITE_SUPABASE_URL" | "VITE_SUPABASE_ANON_KEY") =>
  (typeof import.meta !== "undefined" && (import.meta as any).env?.[k]) || process.env[k]; // used gpt

export default createClient(env("VITE_SUPABASE_URL")!, env("VITE_SUPABASE_ANON_KEY")!, {auth: {persistSession: true,autoRefreshToken: true,storageKey: 'sb-session',}});


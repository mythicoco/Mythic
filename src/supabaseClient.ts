import { createClient } from "@supabase/supabase-js"

const Supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!, // used gpt
  import.meta.env.VITE_SUPABASE_ANON_KEY!, // used gpt
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'sb-session',
    },
  }
)

export default Supabase
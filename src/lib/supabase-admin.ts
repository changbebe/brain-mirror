import { createClient } from '@supabase/supabase-js'

// Server-only admin client — bypasses RLS, never expose to browser
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { persistSession: false } }
  )
}

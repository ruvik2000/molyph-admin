import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    'Missing SUPABASE_SERVICE_ROLE_KEY. Admin data fetching requires the service role to bypass RLS.'
  )
}

/**
 * Server-only Supabase client using the service role key.
 * Bypasses Row Level Security - use only for admin data fetches after auth checks.
 * Never expose this client or the service role key to the browser.
 */
export const adminSupabase = createClient(supabaseUrl, serviceRoleKey)

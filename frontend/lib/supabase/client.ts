import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton instance pro browser
let browserInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

// Singleton instance pro server
let serverInstance: ReturnType<typeof createClient<Database>> | null = null

export function createSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side
    if (!serverInstance) {
      serverInstance = createClient<Database>(
        supabaseUrl,
        supabaseKey,
        {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
          }
        }
      )
    }
    return serverInstance
  }

  // Browser-side
  if (!browserInstance) {
    browserInstance = createBrowserClient<Database>(
      supabaseUrl,
      supabaseKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    )
  }
  return browserInstance
}

export const supabase = createSupabaseClient()

export default supabase

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export const createClient = () => {
  const debug = process.env.DEBUG === 'true';
  const enableRealtime = process.env.ENABLE_REALTIME === 'true';

  return createClientComponentClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        debug,
      },
      realtime: {
        enabled: enableRealtime,
      },
    },
  })
}

const supabase = createClient()

export default supabase

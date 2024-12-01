import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/supabase'

export const createClient = () => {
  const debug = process.env.DEBUG === 'true';
  const enableRealtime = process.env.ENABLE_REALTIME === 'true';

  console.log('Creating Supabase client with:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'PRESENT' : 'MISSING',
    debug,
    enableRealtime
  });

  const client = createClientComponentClient<Database>({
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
  });

  // Přidáme globální error handler
  client.on('error', (error) => {
    console.error('Supabase global error:', error);
  });

  return client;
}

const supabase = createClient()

export default supabase

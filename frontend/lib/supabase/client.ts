import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseKey ? 'Key present' : 'Key missing')

export function createSupabaseClient() {
  try {
    console.log('Creating Supabase client')
    const client = createClient<Database>(
      supabaseUrl,
      supabaseKey
    )
    console.log('Supabase client created successfully')
    return client
  } catch (error) {
    console.error('Error creating Supabase client:', error)
    throw error
  }
}

export function createBrowserSupabaseClient() {
  try {
    console.log('Creating Browser Supabase client')
    const client = createBrowserClient<Database>(
      supabaseUrl,
      supabaseKey
    )
    console.log('Browser Supabase client created successfully')
    return client
  } catch (error) {
    console.error('Error creating Browser Supabase client:', error)
    throw error
  }
}

export const authHelpers = {
  signUp: async (email: string, password: string) => {
    const supabase = createSupabaseClient()
    return await supabase.auth.signUp({
      email,
      password,
    });
  },

  signIn: async (email: string, password: string) => {
    const supabase = createSupabaseClient()
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signOut: async () => {
    const supabase = createSupabaseClient()
    return await supabase.auth.signOut();
  },

  getCurrentUser: () => {
    const supabase = createSupabaseClient()
    return supabase.auth.getUser();
  },
};

export const dbHelpers = {
  fetchData: async (table: string, select: string = '*') => {
    const supabase = createSupabaseClient()
    return await supabase.from(table).select(select);
  },

  insertData: async (table: string, data: any) => {
    const supabase = createSupabaseClient()
    return await supabase.from(table).insert(data);
  },

  updateData: async (table: string, id: number, data: any) => {
    const supabase = createSupabaseClient()
    return await supabase.from(table).update(data).eq('id', id);
  },

  deleteData: async (table: string, id: number) => {
    const supabase = createSupabaseClient()
    return await supabase.from(table).delete().eq('id', id);
  },
};

import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export const authHelpers = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },
};

export const dbHelpers = {
  fetchData: async (table: string, select: string = '*') => {
    return await supabase.from(table).select(select);
  },

  insertData: async (table: string, data: any) => {
    return await supabase.from(table).insert(data);
  },

  updateData: async (table: string, id: number, data: any) => {
    return await supabase.from(table).update(data).eq('id', id);
  },

  deleteData: async (table: string, id: number) => {
    return await supabase.from(table).delete().eq('id', id);
  },
};

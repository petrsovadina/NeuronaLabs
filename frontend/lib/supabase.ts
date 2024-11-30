import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Centralizovaná konfigurace Supabase klienta
export const createSupabaseClient = () => 
  createClientComponentClient<Database>();

// Serverový klient pro backend operace
export const createServerSupabaseClient = () => 
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

// Definice rolí v systému
export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor', 
  PATIENT = 'patient',
  STAFF = 'staff'
}

// Rozšířená autentizační služba
export const authService = {
  // Registrace nového uživatele
  signUp: async (email: string, password: string, metadata: Record<string, any> = {}) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: {
          ...metadata,
          registered_at: new Date().toISOString()
        }
      }
    });

    if (error) {
      console.error('Registrace selhala:', error);
      throw error;
    }

    return data;
  },

  // Přihlášení uživatele
  signIn: async (email: string, password: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Přihlášení selhalo:', error);
      throw error;
    }

    return data;
  },

  // Odhlášení uživatele
  signOut: async () => {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Odhlášení selhalo:', error);
      throw error;
    }
  },

  // Reset hesla
  resetPassword: async (email: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`
    });

    if (error) {
      console.error('Reset hesla selhal:', error);
      throw error;
    }

    return data;
  },

  // Aktualizace uživatelských údajů
  updateProfile: async (updates: Record<string, any>) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });

    if (error) {
      console.error('Aktualizace profilu selhala:', error);
      throw error;
    }

    return data;
  },

  // Získání aktuálního uživatele
  getCurrentUser: async () => {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Přiřazení role uživateli
  assignRole: async (email: string, role: UserRole) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.updateUser({
      data: { role }
    });

    if (error) {
      console.error('Chyba přiřazení role:', error);
      throw error;
    }

    return data;
  },

  // Kontrola role uživatele
  hasRole: async (role: UserRole) => {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    return user?.user_metadata?.role === role;
  },

  // Hromadná registrace uživatelů
  bulkRegister: async (users: Array<{
    email: string, 
    password: string, 
    role: UserRole,
    metadata?: Record<string, any>
  }>) => {
    const results = await Promise.all(
      users.map(async (userData) => {
        try {
          const { data, error } = await authService.signUp(
            userData.email, 
            userData.password, 
            { 
              ...userData.metadata, 
              role: userData.role 
            }
          );
          return { success: !error, email: userData.email, data };
        } catch (error) {
          return { 
            success: false, 
            email: userData.email, 
            error: error instanceof Error ? error.message : 'Neznámá chyba' 
          };
        }
      })
    );

    return results;
  },

  // Audit uživatelských aktivit
  logUserActivity: async (activity: string) => {
    const supabase = createSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: user.id,
        activity,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error('Chyba logování aktivity:', error);
    }
  },

  /**
   * Odeslání požadavku na reset hesla
   * @param email Email uživatele
   * @returns Promise s výsledkem reset požadavku
   */
  async resetPasswordRequest(email: string): Promise<void> {
    try {
      // Kontrola validity emailu
      if (!email || !this.isValidEmail(email)) {
        throw new Error('Invalid email format');
      }

      // Volání Supabase metody pro reset hesla
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/update-password`
      });

      // Zpracování chyb
      if (error) {
        console.error('Supabase reset password error:', error);
        
        // Mapování specifických chyb
        switch (error.message) {
          case 'User not found':
            throw new Error('User not found');
          case 'Rate limit exceeded':
            throw new Error('Rate limit exceeded');
          default:
            throw new Error('Failed to reset password');
        }
      }

      // Logging úspěšného požadavku
      this.logUserActivity({
        userId: null,
        activity: 'PASSWORD_RESET_REQUEST',
        metadata: { email }
      });
    } catch (err) {
      // Centralizované logování chyb
      this.errorService.captureException(err, {
        context: 'Authentication',
        action: 'resetPassword'
      });

      throw err;
    }
  },

  /**
   * Validace emailového formátu
   * @param email Email k ověření
   * @returns Boolean indikující validitu emailu
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};

// Databázové operace
export const databaseService = {
  // Obecná metoda pro dotazování
  query: async <T>(table: string, filters: Record<string, any> = {}) => {
    const supabase = createSupabaseClient();
    let query = supabase.from(table).select('*');
    
    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;

    if (error) {
      console.error(`Chyba při dotazu do tabulky ${table}:`, error);
      throw error;
    }

    return data as T[];
  },

  // Vložení záznamu
  insert: async <T>(table: string, record: T) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from(table)
      .insert(record)
      .select();

    if (error) {
      console.error(`Chyba při vkládání do tabulky ${table}:`, error);
      throw error;
    }

    return data as T[];
  },

  // Aktualizace záznamu
  update: async <T>(table: string, id: number | string, updates: Partial<T>) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Chyba při aktualizaci v tabulce ${table}:`, error);
      throw error;
    }

    return data as T[];
  },

  // Smazání záznamu
  delete: async (table: string, id: number | string) => {
    const supabase = createSupabaseClient();
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Chyba při mazání v tabulce ${table}:`, error);
      throw error;
    }
  }
};

// Rozšíření databázové služby o metody pro správu uživatelů
export const userService = {
  // Vyhledání uživatelů podle role
  findByRole: async (role: UserRole) => {
    return databaseService.query('users', { role });
  },

  // Aktualizace profilu uživatele
  updateUserProfile: async (userId: string, profileData: Record<string, any>) => {
    return databaseService.update('users', userId, profileData);
  },

  // Deaktivace uživatelského účtu
  deactivateUser: async (userId: string) => {
    return databaseService.update('users', userId, { 
      is_active: false,
      deactivated_at: new Date().toISOString() 
    });
  }
};

// Middleware pro ověření autentizace
export const requireAuth = async () => {
  const supabase = createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Uživatel není přihlášen');
  }

  return user;
};

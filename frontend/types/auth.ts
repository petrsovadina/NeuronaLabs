import { User } from '@supabase/supabase-js';

export interface AuthSession {
  user: User | null;
  accessToken: string | null;
}

export interface AuthState {
  session: AuthSession | null;
  loading: boolean;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export type UserRole = 'admin' | 'doctor' | 'researcher' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

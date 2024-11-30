export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          role: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          role?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          role?: string;
        };
      };
      // Zde můžete přidat další tabulky
    };
    Views: {
      // Případné pohledy
    };
    Functions: {
      // Případné funkce
    };
  };
};

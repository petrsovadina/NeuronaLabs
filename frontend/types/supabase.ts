export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          medical_record_number: string
          first_name: string
          last_name: string
          birth_date: string | null
          gender: 'male' | 'female' | 'other'
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['patients']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Database['public']['Tables']['patients']['Row'], 'id' | 'created_at' | 'updated_at'>>
      }
      dicom_studies: {
        Row: {
          id: string
          patient_id: string
          study_date: string
          modality: string
          description: string | null
          thumbnail_url: string | null
          full_study_url: string | null
          file_size: number | null
          created_at: string
          user_id: string
        }
        Insert: Omit<Database['public']['Tables']['dicom_studies']['Row'], 'id' | 'created_at'>
        Update: Partial<Omit<Database['public']['Tables']['dicom_studies']['Row'], 'id' | 'created_at'>>
      }
    }
    Views: {
      // Případné views
    }
    Functions: {
      // Případné custom funkce
    }
  }
}
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      diagnoses: {
        Row: {
          created_at: string | null
          description: string
          diagnosis_code: string
          doctor_id: string | null
          id: string
          notes: string | null
          patient_id: string | null
          status: Database["public"]["Enums"]["diagnosis_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          diagnosis_code: string
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          status?: Database["public"]["Enums"]["diagnosis_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          diagnosis_code?: string
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          status?: Database["public"]["Enums"]["diagnosis_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diagnoses_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diagnoses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          birth_date: string
          city: string | null
          country: string | null
          created_at: string | null
          doctor_id: string | null
          email: string | null
          first_name: string
          gender: string | null
          id: string
          insurance_company: string | null
          insurance_number: string | null
          insurance_status:
            | Database["public"]["Enums"]["insurance_status"]
            | null
          last_name: string
          medical_record_number: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          status: Database["public"]["Enums"]["patient_status"] | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birth_date: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          doctor_id?: string | null
          email?: string | null
          first_name: string
          gender?: string | null
          id?: string
          insurance_company?: string | null
          insurance_number?: string | null
          insurance_status?:
            | Database["public"]["Enums"]["insurance_status"]
            | null
          last_name: string
          medical_record_number: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          status?: Database["public"]["Enums"]["patient_status"] | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          doctor_id?: string | null
          email?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          insurance_company?: string | null
          insurance_number?: string | null
          insurance_status?:
            | Database["public"]["Enums"]["insurance_status"]
            | null
          last_name?: string
          medical_record_number?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          status?: Database["public"]["Enums"]["patient_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      studies: {
        Row: {
          created_at: string | null
          description: string | null
          dicom_study_uid: string | null
          doctor_id: string | null
          id: string
          notes: string | null
          patient_id: string | null
          storage_path: string | null
          study_date: string
          study_type: Database["public"]["Enums"]["study_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dicom_study_uid?: string | null
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          storage_path?: string | null
          study_date?: string
          study_type: Database["public"]["Enums"]["study_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dicom_study_uid?: string | null
          doctor_id?: string | null
          id?: string
          notes?: string | null
          patient_id?: string | null
          storage_path?: string | null
          study_date?: string
          study_type?: Database["public"]["Enums"]["study_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "studies_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "studies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          last_name: string
          license_number: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          specialization: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          id: string
          is_active?: boolean | null
          last_name: string
          license_number?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          last_name?: string
          license_number?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          specialization?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      diagnosis_status: "preliminary" | "confirmed" | "archived"
      insurance_status: "active" | "expired" | "pending"
      patient_status: "active" | "inactive" | "archived"
      study_type: "mri" | "ct" | "xray" | "ultrasound" | "other"
      user_role: "admin" | "doctor" | "nurse" | "receptionist"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never


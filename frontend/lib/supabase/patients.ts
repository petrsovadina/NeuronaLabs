import { createBrowserSupabaseClient } from './client'
import { Database } from '@/types/supabase'

type Patient = Database['public']['Tables']['patients']['Row']
type DicomStudy = Database['public']['Tables']['dicom_studies']['Row']

export async function fetchPatients(): Promise<Patient[]> {
  const supabase = createBrowserSupabaseClient()
  
  const { data, error } = await supabase
    .from('patients')
    .select('*')

  if (error) throw error
  return data || []
}

export async function createPatient(patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createBrowserSupabaseClient()
  
  const { data, error } = await supabase
    .from('patients')
    .insert(patient)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPatientDicomStudies(patientId: string): Promise<DicomStudy[]> {
  const supabase = createBrowserSupabaseClient()
  
  const { data, error } = await supabase
    .from('dicom_studies')
    .select('*')
    .eq('patient_id', patientId)

  if (error) throw error
  return data || []
}

export async function uploadDicomStudy(
  dicomStudy: Omit<DicomStudy, 'id' | 'created_at'>
) {
  const supabase = createBrowserSupabaseClient()
  
  const { data, error } = await supabase
    .from('dicom_studies')
    .insert(dicomStudy)
    .select()
    .single()

  if (error) throw error
  return data
}

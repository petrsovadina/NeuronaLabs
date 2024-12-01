import { createClient } from './client'
import { Database } from '@/types/supabase'

const supabase = createClient()

type Patient = Database['public']['Tables']['patients']['Row']
type NewPatient = Omit<Patient, 'id' | 'created_at' | 'updated_at'>
type DicomStudy = Database['public']['Tables']['dicom_studies']['Row']

const REQUIRED_FIELDS = ['first_name', 'last_name', 'birth_date'] as const;

export async function fetchPatients(): Promise<Patient[]> {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      throw new Error(error.message)
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching patients:', error)
    throw error
  }
}

export async function createPatient(patientData: Partial<Patient>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to create a patient')
  }

  // Validate required fields
  for (const field of REQUIRED_FIELDS) {
    if (!patientData[field]) {
      throw new Error(`${field.replace('_', ' ')} is required`)
    }
  }

  // Generate medical record number if not provided
  if (!patientData.medical_record_number) {
    patientData.medical_record_number = `MRN${Date.now()}`
  }

  // Add default values
  const patientWithMetadata = {
    ...patientData,
    status: patientData.status || 'active',
    insurance_status: patientData.insurance_status || 'pending',
    gender: patientData.gender || 'other',
    country: patientData.country || 'Czech Republic',
    created_by: user.id,
    // Pokud není zadán assigned_doctor_id, použít ID current usera
    assigned_doctor_id: patientData.assigned_doctor_id || user.id
  }

  const { data, error } = await supabase
    .from('patients')
    .insert(patientWithMetadata)
    .select()

  if (error) {
    console.error('Error creating patient:', error)
    throw error
  }

  return data[0]
}

export async function updatePatient(patientId: string, patientData: Partial<Patient>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User must be authenticated to update a patient')
  }

  const { data, error } = await supabase
    .from('patients')
    .update({
      ...patientData,
      updated_at: new Date().toISOString()
    })
    .eq('id', patientId)
    .select()

  if (error) {
    console.error('Error updating patient:', error)
    throw error
  }

  return data[0]
}

export async function getPatientDicomStudies(patientId: string): Promise<DicomStudy[]> {
  try {
    const { data, error } = await supabase
      .from('dicom_studies')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error('Error fetching DICOM studies:', error)
    throw error
  }
}

export async function uploadDicomStudy(dicomStudy: Omit<DicomStudy, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('dicom_studies')
      .insert(dicomStudy)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw new Error(error.message)
    }

    if (!data) {
      throw new Error('No data returned from database')
    }

    return data
  } catch (error) {
    console.error('Error uploading DICOM study:', error)
    throw error
  }
}

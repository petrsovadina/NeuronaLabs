import {
  Diagnosis,
  DicomInstance,
  DicomSeries,
  DicomStudy,
  Doctor,
  Patient,
  StudyNote,
} from '@/types/database.types';
import { Database } from '@/types/supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Pacienti
export async function getPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('last_name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getPatientById(id: string) {
  const { data, error } = await supabase
    .from('patients')
    .select(
      `
      *,
      dicom_studies (
        *,
        diagnoses (*),
        study_notes (*)
      )
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// DICOM Studie
export async function getDicomStudies(patientId?: string) {
  let query = supabase
    .from('dicom_studies')
    .select(
      `
      *,
      patient:patients (*),
      doctor:doctors (*),
      diagnoses (*),
      study_notes (*)
    `
    )
    .order('study_date', { ascending: false });

  if (patientId) {
    query = query.eq('patient_id', patientId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getDicomStudyById(id: string) {
  const { data, error } = await supabase
    .from('dicom_studies')
    .select(
      `
      *,
      patient:patients (*),
      doctor:doctors (*),
      diagnoses (*),
      study_notes (*),
      dicom_series (
        *,
        dicom_instances (*)
      )
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// DICOM Upload
export async function uploadDicomFile(
  file: File,
  patientId: string,
  studyId: string,
  seriesId: string
) {
  const filePath = `${patientId}/${studyId}/${seriesId}/${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('dicom-files')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  return filePath;
}

// Diagnózy
export async function createDiagnosis(diagnosis: Partial<Diagnosis>) {
  const { data, error } = await supabase
    .from('diagnoses')
    .insert(diagnosis)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Poznámky
export async function createStudyNote(note: Partial<StudyNote>) {
  const { data, error } = await supabase
    .from('study_notes')
    .insert(note)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Storage helpers
export function getPublicUrl(filePath: string) {
  const { data } = supabase.storage.from('dicom-files').getPublicUrl(filePath);

  return data.publicUrl;
}

// Audit log helper
export async function getAuditLog(
  entityType?: string,
  entityId?: string,
  limit = 50
) {
  let query = supabase
    .from('audit_log')
    .select(
      `
      *,
      doctor:doctors (
        first_name,
        last_name
      )
    `
    )
    .order('created_at', { ascending: false })
    .limit(limit);

  if (entityType) {
    query = query.eq('entity_type', entityType);
  }

  if (entityId) {
    query = query.eq('entity_id', entityId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

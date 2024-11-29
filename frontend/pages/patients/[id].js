import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import PatientForm from '../../components/PatientForm'

export default function PatientDetail() {
  const router = useRouter()
  const { id } = router.query
  const [patient, setPatient] = useState(null)
  const [diagnosticData, setDiagnosticData] = useState([])
  const [dicomStudies, setDicomStudies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const supabase = useSupabaseClient()

  useEffect(() => {
    async function fetchPatientData() {
      if (!id) return
      try {
        // Fetch patient data
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', id)
          .single()
        
        if (patientError) throw patientError
        setPatient(patientData)

        // Fetch diagnostic data
        const { data: diagnosticData, error: diagnosticError } = await supabase
          .from('diagnostic_data')
          .select('*')
          .eq('patient_id', id)
        
        if (diagnosticError) throw diagnosticError
        setDiagnosticData(diagnosticData)

        // Fetch DICOM studies
        const { data: dicomStudies, error: dicomError } = await supabase
          .from('dicom_studies')
          .select('*')
          .eq('patient_id', id)
        
        if (dicomError) throw dicomError
        setDicomStudies(dicomStudies)

      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPatientData()
  }, [id, supabase])

  const handleUpdate = async (updatedPatient) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updatedPatient)
        .eq('id', id)
      
      if (error) throw error

      setPatient(updatedPatient)
      setIsEditing(false)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDelete = async () => {
    if (confirm('Opravdu chcete smazat tohoto pacienta?')) {
      try {
        const { error } = await supabase
          .from('patients')
          .delete()
          .eq('id', id)
        
        if (error) throw error

        router.push('/patients')
      } catch (error) {
        setError(error.message)
      }
    }
  }

  if (loading) return <p>Načítání...</p>
  if (error) return <p>Chyba: {error}</p>
  if (!patient) return <p>Pacient nenalezen</p>

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>{patient.name} | NeuronaLabs</title>
      </Head>

      <main className="py-20">
        <h1 className="text-4xl font-bold mb-8">{patient.name}</h1>
        {isEditing ? (
          <PatientForm patient={patient} onSubmit={handleUpdate} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Základní informace</h2>
              <p>Datum narození: {new Date(patient.date_of_birth).toLocaleDateString()}</p>
              <p>Pohlaví: {patient.gender}</p>
              <p>Poslední diagnóza: {patient.last_diagnosis}</p>
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Upravit
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Smazat
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Diagnostická data</h2>
              <ul>
                {diagnosticData.map((data) => (
                  <li key={data.id} className="mb-2">
                    <p><strong>{data.diagnosis_type}</strong> - {new Date(data.date).toLocaleDateString()}</p>
                    <p>{data.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">DICOM studie</h2>
          <ul>
            {dicomStudies.map((study) => (
              <li key={study.study_instance_uid} className="mb-2">
                <p>
                  <strong>{study.modality}</strong> - {new Date(study.study_date).toLocaleDateString()}
                </p>
                <p>StudyInstanceUID: {study.study_instance_uid}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}


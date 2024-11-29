import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import PatientForm from '../../components/PatientForm'

export default function NewPatient() {
  const [error, setError] = useState(null)
  const router = useRouter()
  const supabase = useSupabaseClient()

  const handleSubmit = async (patientData) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
      
      if (error) throw error

      router.push('/patients')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Přidat nového pacienta | NeuronaLabs</title>
      </Head>

      <h1 className="text-2xl font-bold mb-4">Přidat nového pacienta</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <PatientForm onSubmit={handleSubmit} />
    </div>
  )
}


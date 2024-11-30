'use client'

import { useState } from 'react'
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableCell,
  TableHead
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { 
  fetchPatients, 
  createPatient 
} from '@/lib/supabase/patients'
import { Database } from '@/types/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

type Patient = Database['public']['Tables']['patients']['Row']

export default function PatientsPage() {
  const queryClient = useQueryClient()
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({})

  const { 
    data: patients, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
    retry: 1
  })

  const createPatientMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      setNewPatient({}) // Reset formuláře
    },
    onError: (error) => {
      console.error('Chyba při vytváření pacienta:', error)
      // Zde můžete přidat toast nebo jiné oznámení
    }
  })

  const handleCreatePatient = () => {
    if (!newPatient.first_name || !newPatient.last_name) {
      console.error('Jméno a příjmení jsou povinné')
      return
    }

    createPatientMutation.mutate(newPatient as Omit<Patient, 'id' | 'created_at' | 'updated_at'>)
  }

  if (isLoading) return <div>Načítání pacientů...</div>
  
  if (error) return (
    <div className="text-red-500">
      Chyba při načítání pacientů: {error instanceof Error ? error.message : 'Neznámá chyba'}
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Správa pacientů</h1>
      
      <div className="mb-4 space-y-2">
        <div className="flex space-x-2">
          <input 
            type="text"
            placeholder="Jméno"
            value={newPatient.first_name || ''}
            onChange={(e) => setNewPatient(prev => ({
              ...prev, 
              first_name: e.target.value
            }))}
            className="border p-2 rounded"
          />
          <input 
            type="text"
            placeholder="Příjmení"
            value={newPatient.last_name || ''}
            onChange={(e) => setNewPatient(prev => ({
              ...prev, 
              last_name: e.target.value
            }))}
            className="border p-2 rounded"
          />
          <Button 
            onClick={handleCreatePatient}
            disabled={createPatientMutation.isPending}
          >
            {createPatientMutation.isPending ? 'Ukládání...' : 'Přidat pacienta'}
          </Button>
        </div>
        {createPatientMutation.isError && (
          <div className="text-red-500">
            Chyba: {createPatientMutation.error instanceof Error 
              ? createPatientMutation.error.message 
              : 'Neznámá chyba'}
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Jméno</TableHead>
            <TableHead>Číslo záznamu</TableHead>
            <TableHead>Kontakt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients?.map(patient => (
            <TableRow key={patient.id}>
              <TableCell>{patient.first_name} {patient.last_name}</TableCell>
              <TableCell>{patient.medical_record_number}</TableCell>
              <TableCell>{patient.contact_email || 'Neuvedeno'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

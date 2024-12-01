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
import { useToast } from '@/components/ui/use-toast'
import { 
  fetchPatients, 
  createPatient 
} from '@/lib/supabase/patients'
import { Database } from '@/types/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DataTable } from '@/components/patients/data-table/data-table'
import { columns } from '@/components/patients/data-table/columns'

type Patient = Database['public']['Tables']['patients']['Row']

export default function PatientsPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [newPatient, setNewPatient] = useState<Partial<Patient>>({
    birth_date: new Date().toISOString().split('T')[0],
    gender: 'other',
    country: 'Czech Republic'
  })

  const { 
    data: patients, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
    retry: 1,
    onError: (error: any) => {
      toast({
        title: 'Chyba při načítání',
        description: error instanceof Error ? error.message : 'Nepodařilo se načíst seznam pacientů',
        variant: 'destructive',
      })
    }
  })

  const createPatientMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      setNewPatient({
        birth_date: new Date().toISOString().split('T')[0],
        gender: 'other',
        country: 'Czech Republic'
      })
      toast({
        title: 'Pacient vytvořen',
        description: 'Nový pacient byl úspěšně přidán do systému',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Chyba při vytváření',
        description: error instanceof Error ? error.message : 'Nepodařilo se vytvořit pacienta',
        variant: 'destructive',
      })
    }
  })

  const handleCreatePatient = () => {
    if (!newPatient.first_name?.trim() || !newPatient.last_name?.trim() || !newPatient.birth_date) {
      toast({
        title: 'Chybějící údaje',
        description: 'Prosím vyplňte všechna povinná pole (jméno, příjmení a datum narození)',
        variant: 'destructive',
      })
      return
    }

    createPatientMutation.mutate(newPatient)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Načítání seznamu pacientů...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Pacienti</h1>
        <div className="text-sm text-muted-foreground">
          Celkem pacientů: {patients?.length || 0}
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Přidat nového pacienta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Jméno <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Zadejte jméno"
              className="w-full p-2 border rounded-md"
              value={newPatient.first_name || ''}
              onChange={(e) => setNewPatient(prev => ({ ...prev, first_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Příjmení <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Zadejte příjmení"
              className="w-full p-2 border rounded-md"
              value={newPatient.last_name || ''}
              onChange={(e) => setNewPatient(prev => ({ ...prev, last_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Datum narození <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded-md"
              value={newPatient.birth_date || ''}
              onChange={(e) => setNewPatient(prev => ({ ...prev, birth_date: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pohlaví</label>
            <select
              className="w-full p-2 border rounded-md"
              value={newPatient.gender || 'other'}
              onChange={(e) => setNewPatient(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option value="male">Muž</option>
              <option value="female">Žena</option>
              <option value="other">Jiné</option>
            </select>
          </div>
        </div>
        <Button 
          onClick={handleCreatePatient}
          disabled={createPatientMutation.isPending}
          className="w-full sm:w-auto"
        >
          {createPatientMutation.isPending ? 'Vytvářím...' : 'Přidat pacienta'}
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={patients || []}
        isLoading={isLoading}
      />
    </div>
  )
}

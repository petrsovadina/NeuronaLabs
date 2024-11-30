'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';
import { DiagnosticDataForm } from './diagnostic-data-form';

interface DiagnosticDataListProps {
  patientId: string;
}

export function DiagnosticDataList({ patientId }: DiagnosticDataListProps) {
  const [diagnosticData, setDiagnosticData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadDiagnosticData();
  }, [patientId]);

  async function loadDiagnosticData() {
    const { data, error } = await supabase
      .from('diagnostic_data')
      .select('*')
      .eq('patient_id', patientId)
      .order('diagnosis_date', { ascending: false });

    if (error) {
      console.error('Error loading diagnostic data:', error);
    } else {
      setDiagnosticData(data || []);
    }
    setLoading(false);
  }

  if (loading) {
    return <div>Načítání diagnostických dat...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Přidat diagnostická data</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Přidat nová diagnostická data</DialogTitle>
            </DialogHeader>
            <DiagnosticDataForm
              patientId={patientId}
              onSuccess={() => {
                setAddDialogOpen(false);
                loadDiagnosticData();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {diagnosticData.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Zatím nebyla přidána žádná diagnostická data
            </CardContent>
          </Card>
        ) : (
          diagnosticData.map(data => (
            <Card key={data.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{data.diagnosis_type}</CardTitle>
                    <CardDescription>
                      {new Date(data.diagnosis_date).toLocaleString('cs-CZ')}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      // TODO: Implementovat zobrazení detailu diagnostických dat
                    }}
                  >
                    Zobrazit detail
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {data.notes || 'Žádné poznámky'}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

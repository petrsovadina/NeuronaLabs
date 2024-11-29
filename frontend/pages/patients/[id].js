import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import PatientForm from '../../components/PatientForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientDetailSkeleton } from '@/components/patients/PatientDetailSkeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PatientDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [patient, setPatient] = useState(null);
  const [diagnosticData, setDiagnosticData] = useState([]);
  const [dicomStudies, setDicomStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const supabase = useSupabaseClient();

  useEffect(() => {
    async function fetchPatientData() {
      if (!id) return;
      try {
        // Fetch patient data
        const { data: patientData, error: patientError } = await supabase
          .from('patients')
          .select('*')
          .eq('id', id)
          .single();

        if (patientError) throw patientError;
        setPatient(patientData);

        // Fetch diagnostic data
        const { data: diagnosticData, error: diagnosticError } = await supabase
          .from('diagnostic_data')
          .select('*')
          .eq('patient_id', id);

        if (diagnosticError) throw diagnosticError;
        setDiagnosticData(diagnosticData);

        // Fetch DICOM studies
        const { data: dicomStudies, error: dicomError } = await supabase
          .from('dicom_studies')
          .select('*')
          .eq('patient_id', id);

        if (dicomError) throw dicomError;
        setDicomStudies(dicomStudies);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPatientData();
  }, [id, supabase]);

  const handleUpdate = async updatedPatient => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updatedPatient)
        .eq('id', id);

      if (error) throw error;

      setPatient(updatedPatient);
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    if (confirm('Opravdu chcete smazat tohoto pacienta?')) {
      try {
        const { error } = await supabase.from('patients').delete().eq('id', id);

        if (error) throw error;

        router.push('/patients');
      } catch (error) {
        setError(error.message);
      }
    }
  };

  if (loading) return <PatientDetailSkeleton />;
  if (error) return <p>Chyba: {error}</p>;
  if (!patient) return <p>Pacient nenalezen</p>;

  return (
    <div className="container mx-auto px-4">
      <Head>
        <title>{patient.name} | NeuronaLabs</title>
      </Head>

      <main className="py-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{patient.name}</h1>
          <div className="space-x-4">
            <Button onClick={() => setIsEditing(true)}>
              Upravit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Smazat</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Smazat pacienta</AlertDialogTitle>
                  <AlertDialogDescription>
                    Opravdu chcete smazat tohoto pacienta? Tato akce je nevratná.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Zrušit</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Smazat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {isEditing ? (
          <PatientForm patient={patient} onSubmit={handleUpdate} />
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Přehled</TabsTrigger>
              <TabsTrigger value="diagnostic">Diagnostická data</TabsTrigger>
              <TabsTrigger value="dicom">DICOM studie</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Základní informace</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Datum narození</p>
                        <p className="text-lg font-medium">
                          {new Date(patient.date_of_birth).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Pohlaví</p>
                        <p className="text-lg font-medium">{patient.gender}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Poslední diagnóza</p>
                      <p className="text-lg font-medium">{patient.last_diagnosis}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diagnostic">
              <Card>
                <CardHeader>
                  <CardTitle>Diagnostická data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {diagnosticData.map(data => (
                      <AccordionItem key={data.id} value={data.id}>
                        <AccordionTrigger>
                          <div className="flex justify-between items-center w-full">
                            <span>{data.diagnosis_type}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(data.date).toLocaleDateString()}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <p className="text-muted-foreground">{data.description}</p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dicom">
              <Card>
                <CardHeader>
                  <CardTitle>DICOM studie</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {dicomStudies.map(study => (
                      <AccordionItem key={study.study_instance_uid} value={study.study_instance_uid}>
                        <AccordionTrigger>
                          <div className="flex justify-between items-center w-full">
                            <span>{study.modality}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(study.study_date).toLocaleDateString()}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <p>
                              <span className="font-medium">Study Instance UID:</span>{' '}
                              <span className="text-muted-foreground">{study.study_instance_uid}</span>
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

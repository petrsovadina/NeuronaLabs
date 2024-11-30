import { DicomViewer } from '@/components/dicom/dicom-viewer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface StudyDetailsPageProps {
  params: {
    studyId: string;
  };
}

export default async function StudyDetailsPage({ params }: StudyDetailsPageProps) {
  const supabase = createServerComponentClient({ cookies });

  // Načtení detailů studie z Supabase
  const { data: study } = await supabase
    .from('dicom_studies')
    .select(`
      *,
      patient:patients(*)
    `)
    .eq('study_instance_uid', params.studyId)
    .single();

  if (!study) {
    return <div>Studie nenalezena</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Detail DICOM studie</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informace o studii</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Pacient</dt>
                <dd className="text-base">
                  {study.patient.first_name} {study.patient.last_name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Datum studie</dt>
                <dd className="text-base">
                  {new Date(study.study_date).toLocaleDateString('cs-CZ')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Modalita</dt>
                <dd className="text-base">{study.modality}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Popis</dt>
                <dd className="text-base">{study.description || 'Bez popisu'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Série snímků</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {study.series_count} sérií
              {/* Zde by mohl být seznam sérií */}
            </div>
          </CardContent>
        </Card>
      </div>

      <DicomViewer
        studyInstanceUid={study.study_instance_uid}
        seriesInstanceUid={study.series_instance_uid}
      />
    </div>
  );
}

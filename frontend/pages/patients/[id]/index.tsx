import { withAuth } from '@/components/auth/withAuth';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/router';

function PatientDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // Mockovaná data pacienta - později nahradit real daty
  const patient = {
    id: id,
    name: 'Jan Novák',
    birthDate: '1980-05-15',
    gender: 'Muž',
    email: 'jan.novak@email.cz',
    phone: '+420 123 456 789',
    address: 'Hlavní 123, Praha 1, 110 00',
    insurance: 'VZP',
    insuranceNumber: '123456789',
  };

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{patient.name}</h1>
            <p className="text-muted-foreground">ID: {patient.id}</p>
          </div>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => router.push('/patients')}>
              Zpět na seznam
            </Button>
            <Button onClick={() => router.push(`/patients/${id}/edit`)}>
              Upravit
            </Button>
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Informace</TabsTrigger>
            <TabsTrigger value="studies">DICOM Studie</TabsTrigger>
            <TabsTrigger value="reports">Zprávy</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Osobní informace</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Datum narození</dt>
                    <dd className="text-lg">{patient.birthDate}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Pohlaví</dt>
                    <dd className="text-lg">{patient.gender}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Email</dt>
                    <dd className="text-lg">{patient.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Telefon</dt>
                    <dd className="text-lg">{patient.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Adresa</dt>
                    <dd className="text-lg">{patient.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Pojišťovna</dt>
                    <dd className="text-lg">{patient.insurance}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Číslo pojištěnce</dt>
                    <dd className="text-lg">{patient.insuranceNumber}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="studies">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>DICOM Studie</CardTitle>
                <Button onClick={() => router.push(`/studies/upload?patientId=${id}`)}>
                  Nahrát studii
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Zatím žádné studie</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lékařské zprávy</CardTitle>
                <Button onClick={() => router.push(`/patients/${id}/reports/new`)}>
                  Nová zpráva
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Zatím žádné zprávy</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}

export default withAuth(PatientDetailPage);

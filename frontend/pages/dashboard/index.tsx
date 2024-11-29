import { withAuth } from '@/components/auth/withAuth';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

function DashboardPage() {
  const router = useRouter();

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => router.push('/patients/new')}>
            Nový pacient
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Rychlý přehled */}
          <Card>
            <CardHeader>
              <CardTitle>Pacienti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">123</div>
              <p className="text-sm text-muted-foreground">Celkový počet pacientů</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>DICOM Studie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-sm text-muted-foreground">Celkový počet studií</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Zprávy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">789</div>
              <p className="text-sm text-muted-foreground">Celkový počet zpráv</p>
            </CardContent>
          </Card>
        </div>

        {/* Nedávné aktivity */}
        <Card>
          <CardHeader>
            <CardTitle>Nedávné aktivity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Zde bude seznam aktivit */}
              <p className="text-muted-foreground">Zatím žádné aktivity</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

export default withAuth(DashboardPage);

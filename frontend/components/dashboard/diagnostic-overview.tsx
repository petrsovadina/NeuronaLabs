import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Led', count: 12 },
  { name: 'Úno', count: 19 },
  { name: 'Bře', count: 15 },
  { name: 'Dub', count: 22 },
  { name: 'Kvě', count: 25 },
  { name: 'Čvn', count: 18 },
];

const diagnosticTypes = [
  { name: 'MRI', count: 145, change: '+12%' },
  { name: 'CT', count: 89, change: '+5%' },
  { name: 'EEG', count: 256, change: '+18%' },
  { name: 'EMG', count: 123, change: '+8%' },
];

export function DiagnosticOverview() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Přehled</TabsTrigger>
        <TabsTrigger value="types">Typy vyšetření</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Diagnostická data za posledních 6 měsíců
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="types">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">
              Typy diagnostických vyšetření
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {diagnosticTypes.map((type) => (
                <div
                  key={type.name}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium">{type.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Celkem: {type.count}
                    </p>
                  </div>
                  <span className="text-sm text-green-600">{type.change}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

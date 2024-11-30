'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Calendar, FileText, Users } from 'lucide-react';

interface StatsProps {
  stats: {
    total_patients: number;
    total_diagnoses: number;
    total_reports: number;
    upcoming_appointments: number;
  };
}

export function DashboardStats({ stats }: StatsProps) {
  const items = [
    {
      title: 'Celkem pacientů',
      value: stats?.total_patients || 0,
      icon: Users,
    },
    {
      title: 'Provedené diagnózy',
      value: stats?.total_diagnoses || 0,
      icon: Brain,
    },
    {
      title: 'Vytvořené zprávy',
      value: stats?.total_reports || 0,
      icon: FileText,
    },
    {
      title: 'Nadcházející schůzky',
      value: stats?.upcoming_appointments || 0,
      icon: Calendar,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map(item => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

'use client';

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Overview } from '@/components/dashboard/overview';
import { RecentPatients } from '@/components/dashboard/recent-patients';
import { Activity, Users, Brain, Calendar } from 'lucide-react';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  monthlyExams: number;
  scheduledExams: number;
}

export const metadata: Metadata = {
  title: "Dashboard | NeuronaLabs",
  description: "Přehled pacientů a diagnostických dat",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    monthlyExams: 0,
    scheduledExams: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch total patients
        const { count: totalPatients } = await supabase
          .from('patients')
          .select('*', { count: 'exact' });

        // Fetch active patients (those with recent visits)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { count: activePatients } = await supabase
          .from('patients')
          .select('*', { count: 'exact' })
          .gt('last_visit', thirtyDaysAgo.toISOString());

        // Fetch monthly exams
        const { count: monthlyExams } = await supabase
          .from('examinations')
          .select('*', { count: 'exact' })
          .gt('created_at', thirtyDaysAgo.toISOString());

        // Fetch scheduled exams
        const { count: scheduledExams } = await supabase
          .from('examinations')
          .select('*', { count: 'exact' })
          .gt('scheduled_date', new Date().toISOString())
          .lt(
            'scheduled_date',
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          );

        setStats({
          totalPatients: totalPatients || 0,
          activePatients: activePatients || 0,
          monthlyExams: monthlyExams || 0,
          scheduledExams: scheduledExams || 0,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [supabase]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Celkem pacientů
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.totalPatients}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalPatients > 0
                    ? `+${Math.round((stats.activePatients / stats.totalPatients) * 100)}% aktivních`
                    : 'Žádní pacienti'}
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vyšetření tento měsíc
            </CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.monthlyExams}</div>
                <p className="text-xs text-muted-foreground">
                  Za posledních 30 dní
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Aktivní pacienti
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.activePatients}</div>
                <p className="text-xs text-muted-foreground">
                  Za posledních 30 dní
                </p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Naplánovaná vyšetření
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-[100px]" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.scheduledExams}</div>
                <p className="text-xs text-muted-foreground">
                  Na příštích 7 dní
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Přehled vyšetření</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Suspense fallback={<Skeleton className="h-[350px]" />}>
              <Overview />
            </Suspense>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Nedávní pacienti</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[450px]" />}>
              <RecentPatients />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { authHelpers } from '@/lib/supabase/authHelpers';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authHelpers.getCurrentUser();
      if (!user) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Vítejte ve vašem dashboardu!</p>
    </div>
  );
}

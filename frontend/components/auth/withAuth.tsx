import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { requireAuth?: boolean; roles?: string[] } = {}
) {
  return function WithAuthComponent(props: P) {
    const { session, loading } = useAuth();
    const router = useRouter();
    const { requireAuth = true, roles = [] } = options;

    useEffect(() => {
      if (!loading) {
        if (requireAuth && !session) {
          router.replace({
            pathname: '/login',
            query: { returnUrl: router.asPath },
          });
        } else if (session && roles.length > 0) {
          // Zde můžete přidat kontrolu rolí, pokud je implementujete
          const userRole = session.user?.user_metadata?.role;
          if (!roles.includes(userRole)) {
            router.replace('/unauthorized');
          }
        }
      }
    }, [loading, session, requireAuth, roles, router]);

    if (loading) {
      return (
        <div className="p-8 space-y-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
      );
    }

    if (requireAuth && !session) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

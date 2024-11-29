import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/auth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ErrorBoundary from '../common/ErrorBoundary';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'NeuronaLabs' }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated && router.pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="min-h-screen bg-background">
        {isAuthenticated && <Navbar />}
        
        <div className="flex">
          {isAuthenticated && <Sidebar />}
          
          <main className="flex-1 p-6">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;

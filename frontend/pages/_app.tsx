import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <main className={inter.className}>
          <Component {...pageProps} />
          <Toaster />
        </main>
      </AuthProvider>
    </ErrorBoundary>
  );
}

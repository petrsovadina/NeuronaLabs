import { Navigation } from '@/components/layout/navigation';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Metadata } from 'next';
import { AuthProvider } from '@/providers/AuthProvider';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | NeuronaLabs',
    default: 'NeuronaLabs - Neurologická diagnostická platforma'
  },
  description: 'Komplexní platforma pro neurologickou diagnostiku a správu pacientských dat',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <title>NeuronaLabs</title>
        <meta
          name="description"
          content="Neurologická diagnostická platforma"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <main className="container mx-auto px-4 py-8">{children}</main>
                </div>
                <Toaster />
              </AuthProvider>
            </ThemeProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}

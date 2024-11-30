import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        'flex',
        className
      )}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}

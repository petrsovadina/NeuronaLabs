'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/icons';

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          NeuronaLabs
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="/dashboard"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/dashboard' ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          Dashboard
        </Link>
        <Link
          href="/patients"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/patients')
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          Pacienti
        </Link>
        <Link
          href="/studies"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname?.startsWith('/studies')
              ? 'text-foreground'
              : 'text-foreground/60'
          )}
        >
          Vyšetření
        </Link>
        <Link
          href="/settings"
          className={cn(
            'transition-colors hover:text-foreground/80',
            pathname === '/settings' ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          Nastavení
        </Link>
      </nav>
    </div>
  );
}

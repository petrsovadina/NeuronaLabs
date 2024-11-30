import { cn } from '@/lib/utils';
import { HomeIcon, UsersIcon, ActivityIcon, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface NavItemProps {
  href: string;
  children: ReactNode;
  className?: string;
}

const NavItem = ({ href, children, className }: NavItemProps) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'px-4 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-medical-blue text-white'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
        className
      )}
    >
      {children}
    </Link>
  );
};

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-medical-blue">
                NeuronaLabs
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <HomeIcon className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/patients"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <UsersIcon className="h-4 w-4" />
                <span>Pacienti</span>
              </Link>
              <Link
                href="/diagnostics"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <ActivityIcon className="h-4 w-4" />
                <span>Diagnostika</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              >
                <SettingsIcon className="h-4 w-4" />
                <span>Nastavení</span>
              </Link>
            </nav>

            {/* User menu */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900">
                <span className="sr-only">Notifications</span>
                {/* Notification icon */}
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://via.placeholder.com/32"
                    alt="User avatar"
                  />
                  <span className="hidden md:block text-sm font-medium">
                    Dr. Jan Novák
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              2024 NeuronaLabs. Všechna práva vyhrazena.
            </p>
            <div className="flex space-x-6">
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                Podmínky použití
              </Link>
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                Ochrana soukromí
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex">
          <Link href="/">
            <a className="flex items-center space-x-2">
              <span className="font-bold text-xl">NeuronaLabs</span>
            </a>
          </Link>
          <div className="hidden md:flex items-center space-x-6 ml-6">
            <Link href="/patients">
              <a
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  router.pathname.startsWith('/patients')
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                Patients
              </a>
            </Link>
            <Link href="/studies">
              <a
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  router.pathname.startsWith('/studies')
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                Studies
              </a>
            </Link>
            <Link href="/analytics">
              <a
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  router.pathname.startsWith('/analytics')
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }`}
              >
                Analytics
              </a>
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-base hover:bg-transparent hover:text-primary"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

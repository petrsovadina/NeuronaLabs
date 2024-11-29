import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart2,
  Settings,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: 'Patients',
      href: '/patients',
      icon: Users,
    },
    {
      name: 'Studies',
      href: '/studies',
      icon: FileText,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart2,
    },
  ];

  // Add admin-only navigation items
  if (user?.role === 'Admin') {
    navigation.push({
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    });
  }

  return (
    <div className="hidden md:flex h-screen w-[200px] flex-col border-r bg-background">
      <div className="flex flex-col space-y-1 p-4">
        {navigation.map(item => {
          const isActive =
            router.pathname === item.href ||
            (item.href !== '/' && router.pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href}>
              <a
                className={cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  isActive ? 'bg-accent text-accent-foreground' : 'transparent'
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;

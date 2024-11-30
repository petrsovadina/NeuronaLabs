import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';
import { Image, LayoutDashboard, LogOut, Settings, Users } from 'lucide-react';
import { useRouter } from 'next/router';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pacienti', href: '/patients', icon: Users },
  { name: 'DICOM Viewer', href: '/dicom', icon: Image },
  { name: 'Administrace', href: '/admin', icon: Settings },
];

export function Sidebar() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <span className="text-xl font-semibold">NeuronaLabs</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map(item => {
          const isActive = router.pathname.startsWith(item.href);
          return (
            <Button
              key={item.name}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3',
                isActive && 'bg-gray-100'
              )}
              onClick={() => router.push(item.href)}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => signOut()}
        >
          <LogOut className="h-5 w-5" />
          Odhlásit se
        </Button>
      </div>
    </div>
  );
}

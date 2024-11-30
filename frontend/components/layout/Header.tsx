import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/auth';
import { Bell, Search, User } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement global search
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="h-16 border-b border-gray-200 bg-white px-6">
      <div className="flex h-full items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearch} className="w-96">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Hledat pacienty, diagnózy..."
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              3
            </span>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Můj účet</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{user?.email}</DropdownMenuItem>
              <DropdownMenuItem>Nastavení profilu</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

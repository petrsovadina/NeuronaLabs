'use client';

import { Input } from '@/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export function PatientSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = useDebouncedCallback((term: string) => {
    router.push(pathname + '?' + createQueryString('q', term));
  }, 300);

  return (
    <div className="w-full max-w-sm">
      <Input
        type="search"
        placeholder="Hledat pacienty..."
        className="w-full"
        defaultValue={searchParams.get('q')?.toString()}
        onChange={e => handleSearch(e.target.value)}
      />
    </div>
  );
}

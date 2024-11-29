import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const PUBLIC_ROUTES = ['/', '/login', '/register', '/reset-password'];
const API_ROUTES = ['/api'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // Kontrola API routů
  if (pathname.startsWith('/api/')) {
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    return res;
  }

  // Kontrola chráněných routů
  if (!PUBLIC_ROUTES.includes(pathname)) {
    if (!session) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('returnUrl', pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Přesměrování přihlášených uživatelů z login stránky
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

// Konfigurace middleware - určuje, na které routy se má aplikovat
export const config = {
  matcher: [
    // Aplikuj na všechny routy kromě těch, které začínají:
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

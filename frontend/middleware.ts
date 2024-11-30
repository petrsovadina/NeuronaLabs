import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './lib/database.types';

// Konfigurace chráněných cest
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/admin'
];

// Konfigurace rolí pro specifické cesty
const ROLE_BASED_ROUTES = {
  '/admin': ['admin'],
  '/dashboard/medical': ['doctor', 'admin'],
  '/dashboard/patient': ['patient', 'admin']
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Získání aktuální relace
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  // Kontrola cesty
  const path = req.nextUrl.pathname;

  // Ochrana autentizovaných cest
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    path.startsWith(route)
  );

  if (isProtectedRoute) {
    // Redirect na login, pokud není přihlášen
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // Kontrola rolí pro specifické cesty
    const roleRestrictedRoute = Object.entries(ROLE_BASED_ROUTES).find(
      ([route]) => path.startsWith(route)
    );

    if (roleRestrictedRoute) {
      const [, allowedRoles] = roleRestrictedRoute;
      const userRole = user.user_metadata?.role;

      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  }

  return res;
}

// Konfigurace middlewaru pro sledované cesty
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/profile/:path*', 
    '/settings/:path*', 
    '/admin/:path*'
  ]
};

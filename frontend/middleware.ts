import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './lib/database.types';

// Definice veřejných a chráněných cest
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/auth/callback',
  '/about',
  '/contact'
];

const ROLE_BASED_ROUTES = {
  '/admin': ['admin'],
  '/dashboard/medical': ['doctor', 'admin'],
  '/dashboard/patient': ['patient', 'admin']
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  try {
    // Pokus o refresh session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      // Při chybě session na chráněných cestách přesměrujeme na login
      if (!isPublicRoute(req.nextUrl.pathname)) {
        return redirectToLogin(req);
      }
      return res;
    }

    // Zpracování chráněných cest
    if (!isPublicRoute(req.nextUrl.pathname)) {
      if (!session) {
        return redirectToLogin(req);
      }

      // Kontrola rolí pro specifické cesty
      const userRole = session.user?.user_metadata?.role;
      const requiredRoles = getRequiredRoles(req.nextUrl.pathname);
      
      if (requiredRoles && !requiredRoles.includes(userRole)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    // Přesměrování přihlášených uživatelů z auth stránek
    if (session && isAuthRoute(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Přidání auth hlaviček do response
    if (session) {
      res.headers.set('x-user-id', session.user.id);
      res.headers.set('x-user-role', session.user.user_metadata?.role || 'user');
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // Při neočekávané chybě na chráněných cestách přesměrujeme na login
    if (!isPublicRoute(req.nextUrl.pathname)) {
      return redirectToLogin(req);
    }
    return res;
  }
}

// Helper funkce
function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/auth/');
}

function getRequiredRoles(pathname: string): string[] | null {
  const route = Object.entries(ROLE_BASED_ROUTES)
    .find(([route]) => pathname.startsWith(route));
  return route ? route[1] : null;
}

function redirectToLogin(req: NextRequest): NextResponse {
  const redirectUrl = new URL('/auth/login', req.url);
  // Uložíme původní URL pro redirect po přihlášení
  redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(redirectUrl);
}

// Konfigurace middleware
export const config = {
  matcher: [
    // Aplikujeme middleware na všechny cesty kromě statických souborů a API
    '/((?!_next/static|_next/image|favicon.ico|api/public).*)',
  ]
};

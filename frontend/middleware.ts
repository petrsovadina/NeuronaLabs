import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Database } from '@/types/supabase'

// Definice veřejných cest
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/auth/callback',
  '/about',
  '/contact'
];

// Definice rolí a jejich povolených cest
const ROLE_PATHS: Record<string, string[]> = {
  admin: ['/admin', '/dashboard', '/patients', '/studies', '/diagnoses'],
  doctor: ['/dashboard', '/patients', '/studies', '/diagnoses'],
  nurse: ['/dashboard', '/patients'],
  receptionist: ['/dashboard', '/patients'],
  patient: ['/dashboard/patient']
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Ensure environment variables are loaded
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase environment variables')
    return res
  }

  const supabase = createMiddlewareClient<Database>({ req, res })

  // Refresh session if exists
  const { data: { session } } = await supabase.auth.getSession()

  // Get the pathname
  const path = req.nextUrl.pathname

  // Explicit redirects
  if (path === '/login') {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Allow public paths
  if (PUBLIC_PATHS.some(p => path.startsWith(p))) {
    // If user is already logged in and tries to access auth pages, redirect to dashboard
    if (session && path.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return res
  }

  // Handle authentication
  if (!session) {
    // Redirect to login if not authenticated and trying to access protected routes
    const roleBasedPaths = Object.values(ROLE_PATHS).flat()
    if (roleBasedPaths.some(p => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  } else {
    // Check role-based access
    const userRole = session.user.user_metadata.role || 'user'
    const isAuthorized = Object.entries(ROLE_PATHS).some(
      ([role, paths]) => 
        userRole === role && paths.some(p => path.startsWith(p))
    )

    if (!isAuthorized) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
  }

  return res
}

// Konfigurace middleware - spustí se na všech cestách kromě assets, api, _next
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|public).*)'],
}

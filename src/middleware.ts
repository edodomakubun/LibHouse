import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const { pathname } = request.nextUrl;

  // Protect routes that require login
  const protectedRoutes = ['/upload', '/profile'];

  if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to home if logged in and trying to access login/register
  if ((pathname === '/login' || pathname === '/register') && session) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/upload/:path*', '/profile/:path*', '/login', '/register'],
};

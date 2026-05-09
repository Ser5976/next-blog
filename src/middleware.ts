import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isAdminRoute = createRouteMatcher(['/dashboard(.*)']);
const isAccessDeniedRoute = createRouteMatcher(['/access-denied']);
const isAuthErrorRoute = createRouteMatcher(['/auth-error']);
const isAuthorRoute = createRouteMatcher([
  '/author(.*)',
  '/my-content(.*)',
  '/create(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const userRole = sessionClaims?.metadata?.role as string;

  if (isAuthErrorRoute(req) && userId) {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }
  // Protect access-denied page - only allow if coming from specific redirect
  if (isAccessDeniedRoute(req)) {
    const from = req.nextUrl.searchParams.get('from');

    // Only allow access if redirected from dashboard or author routes
    if (userId && (userRole === 'admin' || userRole === 'author')) {
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }

    // If no 'from' parameter and user is not 'user', redirect to home
    if (!from && userId && userRole !== 'user') {
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // Защита админских маршрутов
  if (isAdminRoute(req)) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set(
        'redirect_url',
        `${req.nextUrl.pathname}${req.nextUrl.search}`
      );
      return NextResponse.redirect(signInUrl);
    }

    if (userRole !== 'admin') {
      const deniedUrl = new URL('/access-denied', req.url);
      // Передаём информацию о том, куда пытались попасть
      deniedUrl.searchParams.set('from', 'dashboard');
      deniedUrl.searchParams.set('required', 'admin');
      deniedUrl.searchParams.set('current', userRole);
      deniedUrl.searchParams.set(
        'redirect',
        `${req.nextUrl.pathname}${req.nextUrl.search}`
      );
      return NextResponse.redirect(deniedUrl);
    }
  }

  // Защита маршрутов для AUTHOR
  if (isAuthorRoute(req)) {
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    if (userRole !== 'author' && userRole !== 'admin') {
      const deniedUrl = new URL('/access-denied', req.url);
      // Передаём информацию о том, куда пытались попасть
      deniedUrl.searchParams.set('from', 'author');
      deniedUrl.searchParams.set('required', 'author');
      deniedUrl.searchParams.set('current', userRole);
      deniedUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(deniedUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

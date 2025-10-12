import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/categories(.*)']);
const isAdminRoute = createRouteMatcher(['/dashboard(.*)', '/admin(.*)']);
const isAuthErrorRoute = createRouteMatcher(['/auth-error']);
const isAuthorRoute = createRouteMatcher([
  '/author(.*)',
  '/my-content(.*)',
  '/create(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();
  const userRole = sessionClaims?.metadata?.role as string;

  // Защита auth-error - только для неавторизованных пользователей
  if (isAuthErrorRoute(req) && userId) {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  // Базовая защита маршрутов

  if (isProtectedRoute(req)) await auth.protect();

  // Защита админских маршрутов - ТОЛЬКО ADMIN
  if (isAdminRoute(req) && userRole !== 'admin') {
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }

  // Защита маршрутов для AUTHOR - AUTHOR и ADMIN имеют доступ
  if (isAuthorRoute(req)) {
    // Проверяем авторизацию
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Проверяем роль (AUTHOR или ADMIN)
    if (userRole !== 'author' && userRole !== 'admin') {
      const url = new URL('/', req.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

'use client';

import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';

import { useClientSearchParams } from '../model';
import { ClientOnly } from './client-only';

export const SignInComponent = () => {
  const { get } = useClientSearchParams();
  const redirectUrl = get('redirect_url') || '/';
  const syncUrl = `/api/sync-user?redirect_url=${encodeURIComponent(redirectUrl)}`;

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 gap-4"
      role="main"
      aria-label="Sign in page"
    >
      <Link
        href="/"
        className="flex items-center gap-3"
        aria-label="VitaFlow Blog - Home page"
      >
        <div
          className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow"
          aria-hidden="true"
        >
          VF
        </div>
        <span className="font-semibold text-2xl">
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            VitaFlow
          </span>
          <span className="text-foreground">Blog</span>
        </span>
      </Link>

      <ClientOnly>
        <SignIn signUpForceRedirectUrl={syncUrl} />
      </ClientOnly>
    </div>
  );
};

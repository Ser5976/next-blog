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
    <>
      <div className="m-4">
        <Link href="/">← Home</Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ClientOnly>
          <SignIn signUpForceRedirectUrl={syncUrl} />
        </ClientOnly>
      </div>
    </>
  );
};

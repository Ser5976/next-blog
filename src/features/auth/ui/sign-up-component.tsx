'use client';

import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';

import { useClientSearchParams } from '../model';
import { ClientOnly } from './client-only';
import { LoadingSpinner } from './loading-spinner';

export const SignUpComponent = () => {
  const { get } = useClientSearchParams();
  const redirectUrl = get('redirect_url') || '/';
  const syncUrl = `/api/sync-user?redirect_url=${encodeURIComponent(redirectUrl)}`;

  return (
    <>
      <div className="m-4">
        <Link href="/">← Home</Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <ClientOnly fallback={<LoadingSpinner />}>
          <SignUp forceRedirectUrl={syncUrl} />
        </ClientOnly>
      </div>
    </>
  );
};

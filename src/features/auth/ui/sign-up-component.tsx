'use client';

import { SignUp } from '@clerk/nextjs';

import { useClientSearchParams } from '../model';
import { ClientOnly } from './client-only';
import { HomeLink } from './home-link';
import { LoadingSpinner } from './loading-spinner';

export const SignUpComponent = () => {
  const { get } = useClientSearchParams();
  const redirectUrl = get('redirect_url') || '/';
  const syncUrl = `/api/sync-user?redirect_url=${encodeURIComponent(redirectUrl)}`;

  return (
    <>
      <HomeLink className=" m-4" />
      <div
        className="flex flex-col items-center justify-center min-h-screen"
        role="main"
        aria-label="Registration page"
      >
        <ClientOnly fallback={<LoadingSpinner />}>
          <SignUp forceRedirectUrl={syncUrl} />
        </ClientOnly>
      </div>
    </>
  );
};

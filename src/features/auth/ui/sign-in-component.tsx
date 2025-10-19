'use client';

import { SignIn } from '@clerk/nextjs';

import { useClientSearchParams } from '../model';
import { ClientOnly } from './client-only';
import { HomeLink } from './home-link';

export const SignInComponent = () => {
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
        <ClientOnly>
          <SignIn signUpForceRedirectUrl={syncUrl} />
        </ClientOnly>
      </div>
    </>
  );
};

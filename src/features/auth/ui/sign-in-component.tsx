'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';

import { useClientSearchParams } from '../model';
import { ClientOnly } from './client-only';

export const SignInComponent = () => {
<<<<<<< HEAD
  const searchParams = useSearchParams();
  // Получаем URL для редиректа после синхронизации
  const redirectUrl = searchParams.get('redirect_url') || '/';
  const syncUrl = `/api/sync-user?redirect_url=${encodeURIComponent(redirectUrl)}`;
=======
  const { get } = useClientSearchParams();
  const redirectUrl = get('redirect_url') || '/';
  const syncUrl = `/api/sync-user?redirect_url=${encodeURIComponent(redirectUrl)}`;

>>>>>>> develop
  return (
    <>
      <div className="m-4">
        <Link href="/">← Home</Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
<<<<<<< HEAD
        <SignIn forceRedirectUrl={syncUrl} />
=======
        <ClientOnly>
          <SignIn signUpForceRedirectUrl={syncUrl} />
        </ClientOnly>
>>>>>>> develop
      </div>
    </>
  );
};

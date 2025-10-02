'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SignIn } from '@clerk/nextjs';

export const SignInComponent = () => {
  const searchParams = useSearchParams();
  // Получаем URL для редиректа после синхронизации
  const redirectUrl = searchParams.get('redirect_url') || '/';
  const syncUrl = `/api/sync-user?redirect_url=${encodeURIComponent(redirectUrl)}`;
  return (
    <>
      <div className="m-4">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Home
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <SignIn forceRedirectUrl={syncUrl} />
      </div>
    </>
  );
};

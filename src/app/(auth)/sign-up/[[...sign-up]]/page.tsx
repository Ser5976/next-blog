'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div>Loading...</div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}

function SignUpContent() {
  const searchParams = useSearchParams();
  // Получаем URL для редиректа после синхронизации
  const redirectUrl = searchParams.get('redirect_url') || '/';
  const syncUrl = `/api/sync-user?redirect_url=${encodeURIComponent(redirectUrl)}`;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp forceRedirectUrl={syncUrl} />
    </div>
  );
}

import { Suspense } from 'react';
import Link from 'next/link';

import { SignInComponent } from '@/features/auth';

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="m-4">
            <Link
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Home
            </Link>
          </div>
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      }
    >
      <SignInComponent />
    </Suspense>
  );
}

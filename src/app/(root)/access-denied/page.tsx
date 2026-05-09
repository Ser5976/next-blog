import { Suspense } from 'react';
import type { Metadata } from 'next';

import { AccessDenied } from '@/features/auth/ui/access-denied';

export const metadata: Metadata = {
  title: 'Access Denied | VitaFlow Blog',
  description: 'You do not have permission to access this page.',
};

export default function AccessDeniedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <AccessDenied />
    </Suspense>
  );
}

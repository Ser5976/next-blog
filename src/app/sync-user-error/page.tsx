import { Suspense } from 'react';

import { SyncUserErrorComponent } from '@/features/sync-user';
import { LoadingSpinner } from '@/shared/ui';

export default function SyncUserErrorPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SyncUserErrorComponent />
    </Suspense>
  );
}

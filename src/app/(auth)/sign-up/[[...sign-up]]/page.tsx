import { Suspense } from 'react';

import { SignUpComponent } from '@/features/auth';
import { LoadingSpinner } from '@/shared/ui';

export default function SignUpPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SignUpComponent />
    </Suspense>
  );
}

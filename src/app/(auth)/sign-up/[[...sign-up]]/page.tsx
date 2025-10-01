import { Suspense } from 'react';

import { SignUpComponent } from '@/features/auth';

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpComponent />
    </Suspense>
  );
}

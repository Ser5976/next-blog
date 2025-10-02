import { Suspense } from 'react';

import { SignInComponent } from '@/features/auth';

export default function SignInPage() {
  return (
    <Suspense>
      <SignInComponent />;
    </Suspense>
  );
}

import { Suspense } from 'react';

import { SyncUserErrorComponent } from '@/features/sync-user';

export default function SyncUserErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Loading...</h1>
            <p className="text-gray-600">Please wait</p>
          </div>
        </div>
      }
    >
      <SyncUserErrorComponent />
    </Suspense>
  );
}

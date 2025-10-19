'use client';

import { useSyncError } from '../model';

export const SyncUserErrorComponent = () => {
  const { errorTitle, errorMessage, errorActions } = useSyncError();

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      role="main"
      aria-labelledby="error-title"
      aria-describedby="error-description"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div
            className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
            role="img"
            aria-label="Warning icon"
          >
            <span className="text-2xl" aria-hidden="true">
              ⚠️
            </span>
          </div>

          <h1
            id="error-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {errorTitle}
          </h1>

          <p id="error-description" className="text-gray-600 mb-6">
            {errorMessage}
          </p>

          <div
            className="space-y-3"
            role="group"
            aria-label="Error resolution actions"
          >
            {errorActions}
          </div>

          <p className="text-xs text-gray-500 mt-6" aria-live="polite">
            If the problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

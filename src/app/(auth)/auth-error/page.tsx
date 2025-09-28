'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/shared/ui/button';

export default function AuthErrorPage() {
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
      <AuthErrorContent />
    </Suspense>
  );
}

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'email_exists':
        return 'An account with this email already exists. Please use a different email or sign in to your existing account.';
      case 'sync_failed':
        return 'An error occurred while creating your profile. Please try registering again.';
      default:
        return 'An unknown error occurred. Please try again.';
    }
  };

  const getActionButtons = () => {
    switch (error) {
      case 'email_exists':
        return (
          <>
            <Button asChild className="w-full">
              <Link href="/sign-in" aria-label="Sign in to existing account">
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link
                href="/sign-up"
                aria-label="Register with a different email"
              >
                Register with Different Email
              </Link>
            </Button>
          </>
        );
      default:
        return (
          <>
            <Button asChild className="w-full">
              <Link href="/sign-up" aria-label="Try registration again">
                Try Again
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/" aria-label="Go to home page">
                Go to Homepage
              </Link>
            </Button>
          </>
        );
    }
  };

  const getErrorTitle = () => {
    switch (error) {
      case 'email_exists':
        return 'Email Already Registered';
      case 'sync_failed':
        return 'Registration Error';
      default:
        return 'Authentication Error';
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      role="main"
      aria-labelledby="error-title"
      aria-describedby="error-description"
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {/* Icon with ARIA attributes */}
          <div
            className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4"
            role="img"
            aria-label="Warning icon"
          >
            <span className="text-2xl" aria-hidden="true">
              ⚠️
            </span>
          </div>

          {/* Title */}
          <h1
            id="error-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {getErrorTitle()}
          </h1>

          {/* Error description */}
          <p id="error-description" className="text-gray-600 mb-6">
            {getErrorMessage()}
          </p>

          {/* Action buttons */}
          <div
            className="space-y-3"
            role="group"
            aria-label="Error resolution actions"
          >
            {getActionButtons()}
          </div>

          {/* Support text */}
          <p className="text-xs text-gray-500 mt-6" aria-live="polite">
            If the problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

import { Button } from '@/shared/ui';

export type ErrorType = 'email_exists' | 'sync_failed' | 'default';

export interface ErrorConfig {
  title: string;
  message: string;
  actions: React.ReactNode;
}

export const ERROR_CONFIGS: Record<ErrorType, ErrorConfig> = {
  email_exists: {
    title: 'Email Already Registered',
    message:
      'An account with this email already exists. Please use a different email or sign in to your existing account.',
    actions: (
      <>
        <Button asChild className="w-full">
          <Link href="/sign-in" aria-label="Sign in to existing account">
            Sign In
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/sign-up" aria-label="Register with a different email">
            Register with Different Email
          </Link>
        </Button>
      </>
    ),
  },
  sync_failed: {
    title: 'Registration Error',
    message:
      'An error occurred while creating your profile. Please try registering again.',
    actions: (
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
    ),
  },
  default: {
    title: 'Authentication Error',
    message: 'An unknown error occurred. Please try again.',
    actions: (
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
    ),
  },
};

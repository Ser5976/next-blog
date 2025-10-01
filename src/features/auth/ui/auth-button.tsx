import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { User } from 'lucide-react';

import { Button } from '@/shared/ui';
import ClientUserButton from './client-user-button';

export const AuthButton = () => {
  return (
    <>
      <SignedOut>
        <SignInButton>
          <Button
            variant="secondary"
            size="icon"
            aria-label="User account"
            className="cursor-pointer"
          >
            <User className="h-5 w-5" aria-hidden="true" />
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Button
          variant="ghost"
          size="icon"
          aria-label="User account"
          className="cursor-pointer"
        >
          <ClientUserButton />
        </Button>
      </SignedIn>
    </>
  );
};

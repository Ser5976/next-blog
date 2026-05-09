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
            variant="outline"
            size="icon"
            aria-label="User account"
            className="cursor-pointer"
          >
            <User className="h-[1.2rem] w-[1.2rem] " aria-hidden="true" />
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Button
          aria-label="User account"
          variant="outline"
          size="icon"
          className="cursor-pointer"
        >
          <ClientUserButton />
        </Button>
      </SignedIn>
    </>
  );
};

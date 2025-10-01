import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';

export const SignInComponent = () => {
  return (
    <>
      <div className="m-4">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Home
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <SignIn />
      </div>
    </>
  );
};

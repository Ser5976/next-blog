'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth, useClerk } from '@clerk/nextjs';
import { Home, Lock, LogOut, Shield } from 'lucide-react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui';

const roleMap: Record<string, string> = {
  admin: 'Administrator',
  author: 'Author',
  user: 'User',
};

const fromMap: Record<
  string,
  { title: string; description: string; icon: React.ReactNode }
> = {
  dashboard: {
    title: 'Dashboard Access Denied',
    description: 'The dashboard is only accessible to administrators.',
    icon: <Shield className="h-12 w-12 text-destructive" />,
  },
  author: {
    title: 'Author Area Access Denied',
    description:
      'Author materials are only accessible to authors and administrators.',
    icon: <Lock className="h-12 w-12 text-warning" />,
  },
};

export function AccessDenied() {
  const searchParams = useSearchParams();
  const { signOut } = useClerk();
  const { userId } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const from = searchParams.get('from');
  const required = searchParams.get('required');
  const current = searchParams.get('current');

  const config = from && fromMap[from] ? fromMap[from] : fromMap.dashboard;

  const handleLogout = async () => {
    await signOut();
    window.location.href = '/';
  };

  const getDescription = () => {
    if (from === 'dashboard') {
      return `Access to the dashboard requires ${roleMap[required || 'admin']} privileges. 
              Your current role: ${roleMap[current || 'user']}. 
              Please contact an administrator to get the necessary permissions.`;
    }

    if (from === 'author') {
      return `Access to author materials requires ${roleMap[required || 'author']} or administrator privileges. 
              Your current role: ${roleMap[current || 'user']}. 
              If you want to become an author, please contact the blog administration.`;
    }

    return 'You do not have sufficient permissions to access this page.';
  };

  // Чтобы избежать ошибки гидратации, рендерим только после монтирования
  if (!mounted) {
    return (
      <div className="container flex min-h-screen items-center justify-center py-12">
        <Card className="mx-auto max-w-2xl w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
              {config.icon}
            </div>
            <CardTitle className="text-3xl">{config.title}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-12">
      <Card className="mx-auto max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            {config.icon}
          </div>
          <CardTitle className="text-3xl">{config.title}</CardTitle>
          <CardDescription className="mt-4 text-base">
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              <strong>What can you do?</strong>
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Make sure you are logged into the correct account</li>
              <li>
                Sign out and sign back in if your permissions were recently
                changed
              </li>
              <li>Return to the homepage and continue browsing content</li>
              {from === 'author' && (
                <li>Apply for author status to get writing privileges</li>
              )}
              {from === 'dashboard' && (
                <li>Contact the system administrator to request access</li>
              )}
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          {userId && (
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

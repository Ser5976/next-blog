'use client';

import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { ShieldUser } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';

type DashboardLinkProps = {
  className?: string;
  onNavigate?: () => void;
};

export const DashboardLink = ({
  className,
  onNavigate,
}: DashboardLinkProps) => {
  const { isLoaded, sessionClaims } = useAuth();
  const role = sessionClaims?.metadata?.role as string | undefined;

  if (!isLoaded || role !== 'admin') {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(' cursor-pointer', className)}
    >
      <Link href="/dashboard" aria-label="Control Panel" onClick={onNavigate}>
        <ShieldUser className="h-[1.2rem] w-[1.2rem] " aria-hidden="true" />
      </Link>
    </Button>
  );
};

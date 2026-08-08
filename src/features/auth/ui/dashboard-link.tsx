'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { ShieldUser, SquarePen } from 'lucide-react';

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
  const [isMounted, setIsMounted] = useState(false);
  const { isLoaded, sessionClaims } = useAuth();
  const role = sessionClaims?.metadata?.role as string | undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Показываем скелетон, пока загружается или до монтирования
  if (!isLoaded || !isMounted) {
    return (
      <Button
        variant="outline"
        className="bg-gray-200 animate-pulse"
        size="icon"
        role="status"
        aria-label="Loading user menu"
        aria-live="polite"
      ></Button>
    );
  }

  if (role !== 'admin' && role !== 'author') {
    return null;
  }

  const href = role === 'admin' ? '/dashboard' : '/author';
  const label = role === 'admin' ? 'Control Panel' : 'Author Panel';

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn('cursor-pointer', className)}
    >
      <Link href={href} aria-label={label} onClick={onNavigate}>
        {role === 'admin' ? (
          <ShieldUser className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
        ) : (
          <SquarePen className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
        )}
      </Link>
    </Button>
  );
};

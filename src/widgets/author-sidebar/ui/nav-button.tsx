'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';
import { AuthorNavButtonProps } from '../model';

export const NavButton = ({
  href,
  icon: Icon,
  children,
  closeSheet,
  exact = false,
}: AuthorNavButtonProps) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} className="block" onClick={closeSheet}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start transition-all cursor-pointer',
          isActive && 'font-medium'
        )}
      >
        <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
        <span className="truncate">{children}</span>
      </Button>
    </Link>
  );
};

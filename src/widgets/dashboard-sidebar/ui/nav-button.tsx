'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';
import { NavButtonProps } from '../model';

export const NavButton = ({
  href,
  icon: Icon,
  children,
  closeSheet,
  exact = false,
}: NavButtonProps) => {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  const handleClick = () => {
    closeSheet?.();
  };

  return (
    <Link href={href} className="block">
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start transition-all',
          isActive && 'font-medium'
        )}
        onClick={handleClick}
      >
        <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
        <span className="truncate">{children}</span>
      </Button>
    </Link>
  );
};

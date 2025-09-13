'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/lib';
import { Category } from '../model/types';

export const CategoryLink = ({ category }: { category: Category }) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(`/categories/${category.slug}`);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase',
        isActive ? 'text-foreground' : 'text-muted-foreground'
      )}
      aria-label={`Go to category ${category.name}`}
    >
      {category.name}
    </Link>
  );
};

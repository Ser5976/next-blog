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
        'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors capitalize ',
        isActive ? 'text-foreground' : 'text-muted-foreground'
      )}
      aria-label={`View posts in ${category.name} category`}
      aria-current={isActive ? 'page' : undefined}
      role="link"
    >
      {category.name}
    </Link>
  );
};

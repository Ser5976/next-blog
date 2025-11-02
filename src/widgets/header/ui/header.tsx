import { Suspense } from 'react';
import Link from 'next/link';

import { Category } from '@/entities/category';
import { AuthButton } from '@/features/auth';
import { CategoriesMenu } from '@/features/categories-menu';
import { SearchForm } from '@/features/search';
import { ThemeToggle } from '@/features/theme-toggle';
import { cn } from '@/shared/lib';
import { MobileMenu } from '@/widgets/mobile-menu';

interface HeaderProps {
  categories: Category[] | undefined;
}

export const Header = ({ categories }: HeaderProps) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-border',
        'bg-background/70 backdrop-blur'
      )}
      role="banner"
      aria-label="Site header"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="VitaFlow Blog - Home page"
        >
          <div
            className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow"
            aria-hidden="true"
          >
            VF
          </div>
          <span className="font-semibold text-2xl">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              VitaFlow
            </span>
            <span className="text-foreground">Blog</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <CategoriesMenu categories={categories} />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search (tablet/desktop) */}
          <SearchForm />

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Avatar / user icon */}

          <div className="hidden sm:flex items-center justify-between">
            <Suspense
              fallback={
                <div
                  className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"
                  role="status"
                  aria-label="Loading user menu"
                  aria-live="polite"
                />
              }
            >
              <AuthButton />
            </Suspense>
          </div>

          {/* Mobile menu */}
          <MobileMenu categories={categories} />
        </div>
      </div>
    </header>
  );
};

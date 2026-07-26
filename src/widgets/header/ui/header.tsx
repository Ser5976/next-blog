import { Suspense } from 'react';
import Link from 'next/link';

import { AuthButton, DashboardLink } from '@/features/auth';
import { CategoriesMenu } from '@/features/categories-menu';
import { SearchForm } from '@/features/search';
import { ThemeToggle } from '@/features/theme-toggle';
import { cn } from '@/shared/lib';
import { CategoriesSkeleton } from '@/shared/ui';
import { MobileCategoriesList } from '@/widgets/mobile-menu/ui/mobile-categories-list';
import { MobileMenu } from '@/widgets/mobile-menu/ui/mobile-menu';

export const Header = () => {
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
        <Suspense
          fallback={
            <CategoriesSkeleton
              direction="horizontal"
              variant="shimmer"
              count={5}
            />
          }
        >
          <CategoriesMenu />
        </Suspense>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search (tablet/desktop) */}
          <SearchForm />

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Avatar / user icon */}

          <div className="hidden sm:flex items-center gap-2 justify-between min-w-[80px]">
            <div className="flex items-center gap-2">
              <AuthButton />
              <DashboardLink />
            </div>
          </div>

          {/* Mobile menu */}

          <MobileMenu>
            <Suspense
              fallback={
                <CategoriesSkeleton
                  count={5}
                  direction="vertical"
                  variant="shimmer"
                  showIcon={false}
                />
              }
            >
              <MobileCategoriesList />
            </Suspense>
          </MobileMenu>
        </div>
      </div>
    </header>
  );
};

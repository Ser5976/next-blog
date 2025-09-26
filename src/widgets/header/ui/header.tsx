import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { User } from 'lucide-react';

import ClientUserButton from '@/client-user-button';
import { Category } from '@/entities/category';
import { CategoriesMenu } from '@/features/categories-menu';
import { SearchForm } from '@/features/search';
import { ThemeToggle } from '@/features/theme-toggle';
import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';
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
          aria-label="Createx Blog - Home page"
        >
          <div
            className="h-9 w-9 rounded-md bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white font-bold shadow"
            aria-hidden="true"
          >
            CX
          </div>
          <span className="font-semibold text-2xl">
            Createx<span className="text-primary">Blog</span>
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
            <SignedOut>
              <SignInButton>
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label="User account"
                  className="cursor-pointer "
                >
                  <User className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button
                variant="ghost"
                size="icon"
                aria-label="User account"
                className="cursor-pointer "
              >
                <ClientUserButton />
              </Button>
            </SignedIn>
          </div>

          {/* Mobile menu */}
          <MobileMenu categories={categories} />
        </div>
      </div>
    </header>
  );
};

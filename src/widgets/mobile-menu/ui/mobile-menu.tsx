'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Category, CategoryLink } from '@/entities/category';
import { DashboardLink, UserProfile } from '@/features/auth';
import { SearchForm } from '@/features/search';
import {
  Button,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui';

interface MobileMenuProps {
  categories: Category[] | undefined;
}

export const MobileMenu = ({ categories }: MobileMenuProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet modal={false} open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          aria-label="Open mobile menu"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <Menu className="h-[1.2rem] w-[1.2rem] " aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[75%] sm:w-[400px]"
        aria-label="Mobile navigation menu"
        role="dialog"
        aria-modal="true"
      >
        <SheetTitle>
          <div className="px-4 py-6 border-b">
            <Link href="/" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-2 px-2">
                <span className="font-semibold text-xl">
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                    VitaFlow
                  </span>
                  <span className="text-foreground">Blog</span>
                </span>
              </div>
            </Link>
          </div>
        </SheetTitle>

        <nav
          className="mt-6 px-3 flex flex-col gap-4"
          aria-label="Mobile navigation"
        >
          <SearchForm variant="mobile" onClose={() => setOpen(false)} />
          <ul
            className="flex px-2 flex-col gap-4"
            role="list"
            aria-label="Categories list"
          >
            {!categories ? (
              <li
                className="text-sm text-muted-foreground"
                aria-live="polite"
                aria-atomic="true"
              >
                ⚠️ What went wrong
              </li>
            ) : categories.length === 0 ? (
              <li
                className="text-sm text-muted-foreground"
                aria-live="polite"
                aria-atomic="true"
              >
                No data available
              </li>
            ) : (
              categories.map((category) => (
                <li
                  key={category.id}
                  onClick={() => setOpen(false)}
                  role="listitem"
                >
                  <CategoryLink category={category} />
                </li>
              ))
            )}
          </ul>
        </nav>
        <div className="mt-auto  border-t flex justify-between items-center">
          <UserProfile />
          <Suspense fallback={null}>
            <DashboardLink
              className=" m-4 "
              onNavigate={() => setOpen(false)}
            />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
};

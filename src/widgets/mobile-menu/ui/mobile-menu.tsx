'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';

import { Category, CategoryLink } from '@/entities/category';
import { AuthButton } from '@/features/auth';
import { SearchForm } from '@/features/search';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui';

interface HeaderProps {
  categories: Category[] | undefined;
}

export const MobileMenu = ({ categories }: HeaderProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open mobile menu"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[75%] sm:w-[400px]"
        aria-label="Mobile navigation menu"
        role="dialog"
        aria-modal="true"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
        </SheetHeader>

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
        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <AuthButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

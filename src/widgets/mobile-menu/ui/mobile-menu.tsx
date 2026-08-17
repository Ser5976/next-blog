'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

import { DashboardLink, UserProfile } from '@/features/auth';
import { SearchForm } from '@/features/search';
import { SearchFormFallback } from '@/features/search/ui';
import {
  Button,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui';

export const MobileMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  //Автоматически закрываем при изменении пути
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden"
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
            <Link href="/">
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
          {/* Search (tablet/desktop), Suspense из-за useSearchParams() */}
          <Suspense fallback={<SearchFormFallback variant="mobile" />}>
            <SearchForm variant="mobile" onClose={() => setOpen(false)} />
          </Suspense>

          {children}
        </nav>
        <div className="mt-auto  border-t flex justify-between items-center">
          <UserProfile />
          <DashboardLink />
        </div>
      </SheetContent>
    </Sheet>
  );
};

'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';

import {
  Button,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/shared/ui';
import { AuthorSidebar } from './author-sidebar';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="md:hidden m-4"
            size="icon"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-author-sidebar-content"
            aria-haspopup="dialog"
          >
            <Menu className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[75%] sm:w-[400px]"
          aria-label="Mobile navigation menu"
          role="dialog"
          aria-modal="true"
        >
          <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
          <AuthorSidebar closeSheet={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      <div
        className="hidden md:block h-screen w-[250px] border-r bg-background sticky top-0"
        id="desktop-author-sidebar"
        aria-label="Author navigation menu"
        role="navigation"
      >
        <AuthorSidebar />
      </div>
    </div>
  );
};

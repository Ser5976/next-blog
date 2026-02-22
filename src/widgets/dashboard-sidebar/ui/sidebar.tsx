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
import { DashboardSidebar } from './dashboard-sidebar';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Mobile Sidebar */}
      <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="md:hidden m-4"
            size="sm"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            aria-controls="mobile-sidebar-content"
            aria-haspopup="dialog"
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
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
          <DashboardSidebar closeSheet={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className="hidden md:block h-screen w-[250px] border-r bg-background sticky top-0"
        id="desktop-sidebar"
        aria-label="Navigation menu"
        role="navigation"
      >
        <DashboardSidebar />
      </div>
    </div>
  );
};

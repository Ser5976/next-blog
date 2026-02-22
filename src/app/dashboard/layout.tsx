import React, { ReactNode } from 'react';
import Link from 'next/link';

import { ThemeToggle } from '@/features/theme-toggle';
import { Sidebar } from '@/widgets/dashboard-sidebar/ui';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen w-full">
      <div className=" md:flex">
        <div className=" flex justify-between items-center md:block">
          <Link href="/" className=" md:hidden">
            <div className="flex items-center gap-2 px-2">
              <span className="font-semibold text-xl">
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  VitaFlow
                </span>
                <span className="text-foreground">Blog</span>
              </span>
            </div>
          </Link>

          <div className=" flex  items-center">
            <div className=" md:hidden">
              <ThemeToggle />
            </div>
            <Sidebar />
          </div>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;

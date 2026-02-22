import Link from 'next/link';

import { UserProfile } from '@/features/auth';
import { ThemeToggle } from '@/features/theme-toggle';
import { NAV_ITEMS } from '../lib';
import { DashboardSidebarProps } from '../model';
import { NavButton } from './nav-button';

export const DashboardSidebar = ({ closeSheet }: DashboardSidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-6 border-b flex gap-8">
        <Link href="/" onClick={closeSheet}>
          <div className="flex items-center gap-2 px-2">
            <span className="font-semibold text-xl">
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                VitaFlow
              </span>
              <span className="text-foreground">Blog</span>
            </span>
          </div>
        </Link>
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavButton
            key={item.href}
            href={item.href}
            icon={item.icon}
            closeSheet={closeSheet}
            exact={item.exact}
          >
            {item.label}
          </NavButton>
        ))}
      </nav>

      {/* User Section (можно добавить позже) */}
      <UserProfile />
    </div>
  );
};

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

import { Category } from '@/entities/category';
import { cn } from '@/shared/lib';

interface CategoriesDropdownProps {
  categories: Category[];
}

export const CategoriesDropdown = ({ categories }: CategoriesDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const isCategoryActive = (slug: string) => {
    return pathname?.startsWith(`/categories/${slug}`);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors',
          'h-7 w-7 rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-2 focus:ring-offset-background cursor-pointer'
        )}
        aria-label="More categories"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="categories-dropdown-menu"
      >
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id="categories-dropdown-menu"
          role="menu"
          aria-label="More categories"
          className={cn(
            'absolute left-0 top-full mt-2 min-w-[180px] rounded-lg border border-border',
            'bg-background/95 backdrop-blur-sm shadow-lg',
            'animate-in fade-in-0 zoom-in-95 duration-200',
            'py-1.5 z-50'
          )}
        >
          {categories.map((category) => {
            const isActive = isCategoryActive(category.slug);
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center px-4 py-2 text-sm transition-colors capitalize',
                  'hover:bg-muted/80 focus:bg-muted/80 focus:outline-none',
                  isActive
                    ? 'text-foreground font-medium bg-muted/50'
                    : 'text-muted-foreground'
                )}
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

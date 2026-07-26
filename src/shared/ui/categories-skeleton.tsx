'use client';

import { cn } from '@/shared/lib';

interface CategoriesSkeletonProps {
  count?: number;
  direction?: 'horizontal' | 'vertical';
  className?: string;
  itemClassName?: string;
  showIcon?: boolean;
  variant?: 'default' | 'shimmer';
}

export const CategoriesSkeleton = ({
  count = 5,
  direction = 'horizontal',
  className,
  itemClassName,
  showIcon = false,
  variant = 'default',
}: CategoriesSkeletonProps) => {
  // Ширины для горизонтального расположения
  const horizontalWidths = [
    'w-16',
    'w-20',
    'w-14',
    'w-24',
    'w-18',
    'w-22',
    'w-12',
  ];

  // Ширины для вертикального расположения
  const verticalWidths = [
    'w-24',
    'w-32',
    'w-20',
    'w-28',
    'w-36',
    'w-26',
    'w-30',
  ];

  const widths = direction === 'horizontal' ? horizontalWidths : verticalWidths;

  // ✅ Улучшенные стили - заметны на любом фоне
  const baseStyles = cn(
    'rounded-md animate-pulse',
    // Добавляем границу для видимости на белом фоне
    'border border-gray-200/50 dark:border-gray-800/50',
    direction === 'horizontal' ? 'h-5' : 'h-6'
  );

  // Цвета для светлой и темной темы
  const colorStyles = cn(
    'bg-gray-200/70 dark:bg-gray-700/70',
    variant === 'shimmer' &&
      'bg-gradient-to-r from-gray-200/50 via-gray-300/70 to-gray-200/50 dark:from-gray-700/50 dark:via-gray-600/70 dark:to-gray-700/50'
  );

  return (
    <nav
      className={cn(
        direction === 'horizontal' ? 'flex gap-6' : 'flex flex-col gap-4',
        className
      )}
      role="status"
      aria-label="Loading categories"
      aria-busy="true"
    >
      <ul
        className={cn(
          'flex',
          direction === 'horizontal' ? 'gap-4' : 'flex-col gap-4'
        )}
        role="list"
      >
        {Array.from({ length: count }).map((_, index) => (
          <li key={index} role="listitem" className="flex items-center gap-3">
            {showIcon && (
              <div
                className={cn(
                  'rounded animate-pulse',
                  'border border-gray-200/50 dark:border-gray-800/50',
                  'bg-gray-200/70 dark:bg-gray-700/70',
                  direction === 'horizontal' ? 'h-4 w-4' : 'h-5 w-5'
                )}
                aria-hidden="true"
              />
            )}

            <div
              className={cn(
                baseStyles,
                colorStyles,
                widths[index % widths.length],
                itemClassName
              )}
              style={
                variant === 'shimmer'
                  ? {
                      animation: 'shimmer 2s infinite',
                      backgroundSize: '200% 100%',
                    }
                  : undefined
              }
              aria-hidden="true"
            />
          </li>
        ))}
      </ul>

      {variant === 'shimmer' && (
        <style jsx>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      )}
    </nav>
  );
};

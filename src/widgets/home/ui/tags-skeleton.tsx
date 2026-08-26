import { Hash } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Subtitle, Title } from '@/shared/ui';

interface TagsSectionSkeletonProps {
  count?: number;
}

export const TagsSectionSkeleton = ({
  count = 6,
}: TagsSectionSkeletonProps) => {
  return (
    <section
      className="border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950 md:py-20"
      aria-label="Loading tags"
      role="status"
      aria-live="polite"
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Заголовок */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Hash className="h-6 w-6 text-emerald-500/50" aria-hidden="true" />
            <Title as="h2">Popular Tags</Title>
          </div>
          <Subtitle className="mx-auto mt-2 max-w-2xl text-base">
            Explore articles by topic and find content that matches your
            interests.
          </Subtitle>
        </div>

        {/* Скелетоны тегов */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-4 py-2.5',
                'bg-gray-100 dark:bg-gray-800',
                'animate-pulse'
              )}
            >
              {/* Иконка */}
              <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700" />

              {/* Название */}
              <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700" />

              {/* Счетчик */}
              <div className="h-3 w-6 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>

        {/* Ссылка на все теги */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </section>
  );
};

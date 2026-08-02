import { cn } from '@/shared/lib';
import { Subtitle, Title } from '@/shared/ui';

interface SearchResultsSkeletonProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  className?: string;
}

export const SearchResultsSkeleton = ({
  title = 'Searching...',
  subtitle = 'Looking for matching articles.',
  limit = 6,
  className,
}: SearchResultsSkeletonProps) => {
  return (
    <div
      className={cn(className)}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-testid="search-results-skeleton"
    >
      <div className="mb-10">
        <Title as="h2" className="text-2xl">
          {title}
        </Title>
        <Subtitle className="mt-2 max-w-2xl text-base">{subtitle}</Subtitle>
      </div>

      <div
        className="grid gap-25 sm:grid-cols-1 lg:grid-cols-2"
        role="list"
        aria-label="Loading search results"
      >
        {Array.from({ length: limit }).map((_, i) => (
          <article
            key={i}
            className="flex flex-col"
            aria-label="Loading article card"
            data-testid={`search-skeleton-card-${i}`}
          >
            <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden bg-gray-200 dark:bg-gray-800">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10" />
            </div>
            <div className="space-y-3">
              <div className="relative h-7 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
              </div>
              <div className="relative h-7 w-3/4 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
              </div>
              <div className="relative h-4 w-24 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
                <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

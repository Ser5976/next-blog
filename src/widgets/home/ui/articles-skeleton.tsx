import { cn } from '@/shared/lib';
import { Subtitle, Title } from '@/shared/ui';

interface HomeArticlesSkeletonProps {
  title: string;
  subtitle: string;
  limit?: number;
  id?: string;
  className?: string;
}

export const ArticlesSkeleton = ({
  title,
  subtitle,
  limit = 6,
  id,
  className,
}: HomeArticlesSkeletonProps) => {
  return (
    <section
      id={id}
      className={cn(
        'border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 py-16 dark:border-gray-800 dark:from-gray-950 dark:to-gray-900 md:py-20',
        className
      )}
      aria-labelledby={`${id}-title`}
      role="status"
      aria-live="polite"
      data-testid={`${id}-skeleton-section`}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-10">
          <Title as="h2" id={`${id}-title`}>
            {title}
          </Title>
          <Subtitle className="mt-2 max-w-2xl text-base">{subtitle}</Subtitle>
        </div>

        <div
          className="grid gap-25 sm:grid-cols-1 lg:grid-cols-2"
          role="list"
          aria-label={`Loading ${title} articles list`}
          data-testid={`${id}-skeleton-list`}
        >
          {Array.from({ length: limit }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ArticleCardSkeleton = () => {
  return (
    <article className="flex flex-col">
      {/* Изображение с shimmer */}
      <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden  bg-gray-200 dark:bg-gray-800">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10" />
      </div>

      {/* Контент */}
      <div className="flex flex-col space-y-3">
        {/* Заголовок с shimmer */}
        <div className="relative h-7 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
        </div>
        <div className="relative h-7 w-3/4 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
        </div>

        {/* Дата с shimmer */}
        <div className="flex items-center gap-1.5">
          <div className="relative h-4 w-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
          </div>
          <div className="relative h-4 w-24 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
          </div>
        </div>

        {/* Текст с shimmer */}
        <div className="space-y-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'relative h-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-800',
                i === 3 ? 'w-1/2' : i === 2 ? 'w-3/4' : 'w-full'
              )}
            >
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
            </div>
          ))}
        </div>

        {/* Теги с shimmer */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'relative h-5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800',
                i === 0 ? 'w-14' : i === 1 ? 'w-16' : 'w-12'
              )}
            >
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

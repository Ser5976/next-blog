import { cn } from '@/shared/lib';
import { Subtitle, Title } from '@/shared/ui';

interface ArticlesSkeletonProps {
  title: string;
  subtitle: string;
  limit?: number;
  id?: string;
  className?: string;
  'data-testid'?: string;
}

export const ArticlesSkeleton = ({
  title,
  subtitle,
  limit = 6,
  id,
  className,
  'data-testid': dataTestId,
}: ArticlesSkeletonProps) => {
  const testId = dataTestId || id || 'articles-skeleton';

  return (
    <section
      id={id}
      className={cn(
        'border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 py-16 dark:border-gray-800 dark:from-gray-950 dark:to-gray-900 md:py-20',
        className
      )}
      aria-labelledby={`${id || testId}-title`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-testid={`${testId}-section`}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-10">
          <Title as="h2">{title}</Title>
          <Subtitle className="mt-2 max-w-2xl text-base">{subtitle}</Subtitle>
        </div>

        <div
          className="grid gap-25 sm:grid-cols-1 lg:grid-cols-2"
          role="list"
          aria-label={`Loading ${title} articles list`}
          data-testid={`${testId}-list`}
        >
          {Array.from({ length: limit }).map((_, i) => (
            <ArticleCardSkeleton
              key={i}
              index={i}
              data-testid={`${testId}-card-${i}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ArticleCardSkeletonProps {
  index?: number;
  'data-testid'?: string;
}

const ArticleCardSkeleton = ({
  index,
  'data-testid': dataTestId = 'article-card-skeleton',
}: ArticleCardSkeletonProps) => {
  const cardTestId =
    index !== undefined ? `${dataTestId}-${index}` : dataTestId;

  return (
    <article
      className="flex flex-col"
      aria-label="Loading article card"
      data-testid={cardTestId}
    >
      {/* Изображение с shimmer */}
      <div
        className="relative mb-5 aspect-[16/9] w-full overflow-hidden bg-gray-200 dark:bg-gray-800"
        aria-hidden="true"
        data-testid={`${cardTestId}-image`}
      >
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/10" />
      </div>

      {/* Контент */}
      <div className="flex flex-col space-y-3">
        {/* Заголовок с shimmer */}
        <div
          className="relative h-7 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-800"
          aria-hidden="true"
          data-testid={`${cardTestId}-title`}
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
        </div>
        <div
          className="relative h-7 w-3/4 overflow-hidden rounded bg-gray-200 dark:bg-gray-800"
          aria-hidden="true"
          data-testid={`${cardTestId}-subtitle`}
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
        </div>

        {/* Дата с shimmer */}
        <div
          className="flex items-center gap-1.5"
          aria-hidden="true"
          data-testid={`${cardTestId}-date`}
        >
          <div className="relative h-4 w-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
          </div>
          <div className="relative h-4 w-24 overflow-hidden rounded bg-gray-200 dark:bg-gray-800">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
          </div>
        </div>

        {/* Текст с shimmer */}
        <div
          className="space-y-1.5"
          aria-hidden="true"
          data-testid={`${cardTestId}-text`}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'relative h-4 overflow-hidden rounded bg-gray-200 dark:bg-gray-800',
                i === 3 ? 'w-1/2' : i === 2 ? 'w-3/4' : 'w-full'
              )}
              data-testid={`${cardTestId}-text-line-${i}`}
            >
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
            </div>
          ))}
        </div>

        {/* Теги с shimmer */}
        <div
          className="flex flex-wrap items-center gap-2 pt-2"
          aria-hidden="true"
          data-testid={`${cardTestId}-tags`}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'relative h-5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800',
                i === 0 ? 'w-14' : i === 1 ? 'w-16' : 'w-12'
              )}
              data-testid={`${cardTestId}-tag-${i}`}
            >
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-700/50" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

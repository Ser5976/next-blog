import { cn } from '@/shared/lib';
import { Subtitle, Title } from '@/shared/ui';

interface CategoriesSkeletonProps {
  count?: number;
  className?: string;
}

export const CategoriesSkeleton = ({
  count = 6,
  className,
}: CategoriesSkeletonProps) => {
  return (
    <section
      className={cn(
        'border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950 md:py-20',
        className
      )}
      aria-label="Loading categories"
      role="status"
      aria-live="polite"
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Заголовок и подзаголовок - показываем сразу */}
        <div className="mb-10 text-center">
          <Title as="h2">Explore Topics</Title>
          <Subtitle className="mx-auto mt-2 max-w-2xl text-base">
            Browse articles by category and find content that matches your
            wellness goals.
          </Subtitle>
        </div>

        {/* Скелетоны для карточек */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <CategorySkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const CategorySkeletonCard = () => {
  return (
    <div
      className={cn(
        'flex items-start gap-4 rounded-xl border border-gray-200 p-5',
        'bg-white dark:border-gray-800 dark:bg-gray-900'
      )}
    >
      {/* Иконка */}
      <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />

      <div className="min-w-0 flex-1 space-y-2">
        {/* Название категории */}
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        {/* Описание */}
        <div className="h-4 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
};

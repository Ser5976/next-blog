import { Category } from '@/entities/category';
import { cn } from '@/shared/lib';
import { Subtitle, Title } from '@/shared/ui';
import { categoryIcons, defaultIcon } from '../constants';

interface CategoryHeaderProps {
  category: Category;
  totalArticles: number;
}

export const CategoryHeader = ({
  category,
  totalArticles,
}: CategoryHeaderProps) => {
  const iconConfig = categoryIcons[category.slug] || defaultIcon;
  const Icon = iconConfig.icon;

  const articlesLabel = totalArticles > 0 ? `${totalArticles}+` : '—';

  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-border/60',
        'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
        'dark:from-emerald-950/40 dark:via-gray-950 dark:to-teal-950/30',
        'min-h-[200px] md:min-h-[240px]'
      )}
      aria-labelledby="category-heading"
    >
      {/* Декоративные элементы */}
      <div
        className="pointer-events-none absolute inset-0 before:absolute before:left-1/3 before:top-0 before:h-[320px] before:w-[320px] before:rounded-full before:bg-gradient-to-r before:from-emerald-400/15 before:to-teal-400/15 before:blur-3xl"
        aria-hidden="true"
      />
      <div
        className={cn(
          'pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br opacity-10 blur-3xl',
          iconConfig.gradient
        )}
        aria-hidden="true"
      />

      <div className="container relative mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start gap-8">
          {/* Иконка категории */}
          <div
            className={cn(
              'flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl',
              'bg-gradient-to-br shadow-lg',
              iconConfig.gradient
            )}
          >
            <Icon
              className={cn('h-10 w-10', iconConfig.color)}
              aria-hidden="true"
            />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                Category
              </span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                {articlesLabel} articles
              </span>
            </div>

            <Title
              as="h1"
              id="category-heading"
              className="text-4xl md:text-5xl capitalize"
            >
              {category.name}
            </Title>

            <Subtitle className="mx-auto max-w-2xl text-base md:mx-0">
              Explore expert articles, practical advice, and scientific research
              about {category.name.toLowerCase()}.
            </Subtitle>
          </div>
        </div>
      </div>
    </section>
  );
};

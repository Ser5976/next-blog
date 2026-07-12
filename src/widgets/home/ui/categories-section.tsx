import Link from 'next/link';
import { Apple, Brain, Dumbbell, Heart, Leaf, Sparkles } from 'lucide-react';

import { getCategories } from '@/entities/category';
import { cn } from '@/shared/lib';
import { Subtitle, Title, UniversalEmpty, UniversalError } from '@/shared/ui';

const categoryIcons = [
  { icon: Leaf, color: 'from-emerald-500 to-green-600' },
  { icon: Apple, color: 'from-lime-500 to-emerald-600' },
  { icon: Dumbbell, color: 'from-teal-500 to-cyan-600' },
  { icon: Brain, color: 'from-violet-500 to-purple-600' },
  { icon: Heart, color: 'from-rose-500 to-pink-600' },
  { icon: Sparkles, color: 'from-amber-500 to-orange-600' },
];

export const CategoriesSection = async () => {
  const categories = await getCategories();
  if (!categories) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        data-testid="categories-section"
        className="container mx-auto max-w-7xl p-4"
      >
        <UniversalError
          title="Failed to load categories"
          message="Something went wrong while fetching categories."
          variant="card"
        />
      </div>
    );
  }
  if (categories.length === 0) {
    return (
      <div role="status" aria-live="polite" data-testid={'categories-empty'}>
        <UniversalEmpty
          title="No categories yet"
          description="Check back soon for new health and wellness content."
        />
      </div>
    );
  }
  return (
    <section
      id="categories"
      className="border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950 md:py-20"
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <Title as="h2">Explore Topics</Title>
          <Subtitle className="mx-auto mt-2 max-w-2xl text-base">
            Browse articles by category and find content that matches your
            wellness goals.
          </Subtitle>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const { icon: Icon, color } =
              categoryIcons[index % categoryIcons.length];

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className={cn(
                  'group flex items-start gap-4 rounded-xl border border-gray-200 p-5',
                  'bg-white transition-all hover:border-emerald-500/40 hover:shadow-lg',
                  'dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-500/30'
                )}
              >
                <div
                  className={cn(
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                    'bg-gradient-to-br text-white shadow-sm',
                    color
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold capitalize text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Read articles about {category.name.toLowerCase()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

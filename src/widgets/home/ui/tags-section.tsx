import Link from 'next/link';
import { Hash } from 'lucide-react';

import { getTagsServer } from '@/entities/dashboard-get-tags';
import { defaultTagIcon, tagIcons } from '@/shared/constants';
import { cn } from '@/shared/lib';
import { Subtitle, Title, UniversalEmpty, UniversalError } from '@/shared/ui';

export const TagsSection = async () => {
  const tags = await getTagsServer();
  if (!tags) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        data-testid="categories-section"
        className="container mx-auto max-w-7xl p-4"
      >
        <UniversalError
          title="Failed to load tags"
          message="Something went wrong while fetching tags."
          variant="card"
        />
      </div>
    );
  }
  if (tags.length === 0) {
    return (
      <div role="status" aria-live="polite" data-testid={'categories-empty'}>
        <UniversalEmpty
          title="No tags yet"
          description="Check back soon for new health and wellness content."
        />
      </div>
    );
  }

  return (
    <section
      className="border-t border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-950 md:py-20"
      aria-labelledby="tags-heading"
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Заголовок */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Hash className="h-6 w-6 text-emerald-500" aria-hidden="true" />
            <Title as="h2" id="tags-heading">
              All Tags
            </Title>
          </div>
          <Subtitle className="mx-auto mt-2 max-w-2xl text-base">
            Explore articles by topic and find content that matches your
            interests.
          </Subtitle>
        </div>

        {/* Сетка тегов */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tags.map((tag) => {
            const iconConfig = tagIcons[tag.slug] || defaultTagIcon;
            const Icon = iconConfig.icon;
            const postCount = tag._count?.posts ?? 0;

            return (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className={cn(
                  'group inline-flex items-center gap-2 rounded-full px-4 py-2.5',
                  'bg-gray-100 text-gray-700 transition-all duration-200',
                  'hover:bg-emerald-100 hover:text-emerald-700 hover:shadow-md',
                  'dark:bg-gray-800 dark:text-gray-300',
                  'dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300',
                  'border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 transition-colors',
                    'text-gray-400 group-hover:text-emerald-500',
                    'dark:text-gray-500 dark:group-hover:text-emerald-400'
                  )}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium">#{tag.name}</span>
                <span
                  className={cn(
                    'ml-0.5 text-xs transition-colors',
                    'text-gray-400 group-hover:text-emerald-500/70',
                    'dark:text-gray-500 dark:group-hover:text-emerald-400/70'
                  )}
                >
                  {postCount}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

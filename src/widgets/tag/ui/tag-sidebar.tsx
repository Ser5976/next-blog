import Link from 'next/link';
import { Clock, Eye, Hash, TrendingUp } from 'lucide-react';

import { Tag } from '@/entities/dashboard-get-tags';
import { DateComponent } from '@/shared/components';
import { cn } from '@/shared/lib';
import { Article } from '@/shared/types';
import { UniversalError } from '@/shared/ui';
import { defaultTagIcon, tagIcons } from '../constants';

interface TagSidebarProps {
  allTags: Tag[] | null;
  popularArticles: Article[];
  currentTagSlug?: string;
}

export const TagSidebar = ({
  allTags,
  popularArticles,
  currentTagSlug,
}: TagSidebarProps) => {
  return (
    <div className="space-y-8">
      {/* Блок со всеми тегами */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        {allTags === null ? (
          <UniversalError
            title="Failed to load tags"
            message={`Unable to load tags. Please try again later.`}
            variant="card"
          />
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Hash className="h-5 w-5 text-emerald-500" aria-hidden="true" />
              <h3 className="text-lg font-semibold">All Tags</h3>
            </div>

            {allTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const iconConfig = tagIcons[tag.slug] || defaultTagIcon;
                  const Icon = iconConfig.icon;
                  const isActive = tag.slug === currentTagSlug;
                  const postCount = tag._count?.posts ?? 0;

                  return (
                    <Link
                      key={tag.id}
                      href={`/tags/${tag.slug}`}
                      className={cn(
                        'group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900/70'
                          : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-3.5 w-3.5 transition-colors',
                          isActive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-gray-400 group-hover:text-emerald-500 dark:text-gray-500 dark:group-hover:text-emerald-400'
                        )}
                        aria-hidden="true"
                      />
                      <span>{tag.name}</span>
                      <span
                        className={cn(
                          'ml-0.5 text-xs',
                          isActive
                            ? 'text-emerald-600/70 dark:text-emerald-400/70'
                            : 'text-gray-400 group-hover:text-emerald-500/70 dark:text-gray-500 dark:group-hover:text-emerald-400/70'
                        )}
                      >
                        {postCount}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No tags available yet.
              </p>
            )}
          </>
        )}
      </div>

      {/* Популярные статьи */}
      {popularArticles.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp
              className="h-5 w-5 text-emerald-500"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">Popular Articles</h3>
          </div>

          <div className="space-y-4">
            {popularArticles.map((article, index) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="group block"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {article.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" aria-hidden="true" />
                        {article.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        <DateComponent date={article.createdAt} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

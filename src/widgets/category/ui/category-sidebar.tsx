import Link from 'next/link';
import { Clock, Eye, TrendingUp } from 'lucide-react';

import { Category } from '@/entities/category';
import { DateComponent } from '@/shared/components';
import { Article } from '@/shared/types';

interface CategorySidebarProps {
  category: Category;
  popularArticles: Article[];
}

export const CategorySidebar = ({
  category,
  popularArticles,
}: CategorySidebarProps) => {
  return (
    <div className="space-y-8">
      {/* О категории */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-semibold">About this category</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Explore articles about {category.name.toLowerCase()}. Stay updated
          with the latest research and practical advice.
        </p>
      </div>

      {/* Популярные статьи */}
      {popularArticles.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp
              className="h-5 w-5 text-emerald-500"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">
              Popular in {category.name}
            </h3>
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

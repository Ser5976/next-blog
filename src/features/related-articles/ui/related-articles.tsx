'use client';

import { ArticleCard } from '@/shared/components';
import { CardSkeleton } from '@/shared/ui';
import { useRelatedArticles } from '../hooks';

export const RelatedArticles = ({ slug }: { slug: string }) => {
  const { data: relatedArticles, isLoading } = useRelatedArticles(slug, 3);

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!relatedArticles || relatedArticles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No related articles found
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {relatedArticles.map((article) => (
        <ArticleCard article={article} key={article.id} role="listitem" />
      ))}
    </div>
  );
};

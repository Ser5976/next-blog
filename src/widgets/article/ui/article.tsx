'use client';

import { useArticle } from '@/entities/get-article';
import { CommentsArticle } from '@/features/comments-article/ui/comments-article';
import { RatingArticle } from '@/features/rating-article';
import { RelatedArticles } from '@/features/related-articles';
import { UniversalError } from '@/shared/ui';
import { LoadingScreen } from '@/shared/ui/loading-screen';
import { useViewCounter } from '../hooks';
import { ArticleContent } from './article-content';
import { ArticleHeader } from './article-header';

export const Article = ({ slug }: { slug: string }) => {
  const { data: article, isLoading, error, refetch } = useArticle(slug);

  useViewCounter(article?.id || '');

  if (isLoading) {
    return (
      <div>
        <LoadingScreen
          title="Loading article..."
          text="Please wait while we fetch the article"
        />
      </div>
    );
  }

  if (error || !article) {
    return (
      <UniversalError
        error={error}
        title="Article not found"
        message="The article you're looking for doesn't exist or has been removed."
        onRetry={refetch}
        variant="card"
      />
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Article Content */}
      <article className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        <ArticleHeader article={article} />

        <div className="mt-8 md:mt-12">
          <ArticleContent content={article.content} />
        </div>
        {/* Related Articles */}
        <div className="mt-12 border-t border-gray-200 bg-gray-50/50 py-12 dark:border-gray-800 dark:bg-gray-900/50">
          <div className="container mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
              You might also like
            </h2>
            <RelatedArticles slug={slug} />
          </div>
        </div>
        {/* Rating Section */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <RatingArticle
            postId={article.id}
            currentRating={article.averageRating}
            ratingCount={article.ratingCount}
          />
        </div>

        {/* Comments Section */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <CommentsArticle
            postId={article.id}
            postSlug={slug}
            initialCommentsCount={article.comments?.length || 0}
          />
        </div>
      </article>
    </main>
  );
};

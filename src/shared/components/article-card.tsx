'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, Star } from 'lucide-react';

import { formatDate } from '@/shared/lib';
import { Article } from '@/shared/types';

interface ArticleCardProps {
  article: Article;
  'data-testid'?: string;
  role?: string;
}

export const ArticleCard = ({
  article,
  'data-testid': dataTestId,
  role,
}: ArticleCardProps) => {
  const cardId = `article-${article.id}`;
  const testId = dataTestId || cardId;

  return (
    <Link
      key={article.id}
      href={`/article/${article.slug}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
      role={role || 'listitem'}
      data-testid={testId}
      aria-labelledby={`${cardId}-title`}
      aria-describedby={`${cardId}-excerpt ${cardId}-meta`}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-testid={`${testId}-image`}
          />
        ) : (
          <div
            className="flex h-full items-center justify-center"
            data-testid={`${testId}-no-image`}
          >
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      <div className="p-4">
        {article.category && (
          <span
            className="mb-2 inline-block text-xs font-medium text-emerald-600 dark:text-emerald-400"
            data-testid={`${testId}-category`}
          >
            {article.category.name}
          </span>
        )}

        <h3
          id={`${cardId}-title`}
          className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-emerald-600 dark:text-white"
          data-testid={`${testId}-title`}
        >
          {article.title}
        </h3>

        <p
          id={`${cardId}-excerpt`}
          className="mb-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400"
          data-testid={`${testId}-excerpt`}
        >
          {article.excerpt}
        </p>

        <div
          id={`${cardId}-meta`}
          className="flex items-center gap-3 text-xs text-gray-400"
          data-testid={`${testId}-meta`}
        >
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            <span data-testid={`${testId}-date`}>
              {formatDate(article.createdAt)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" aria-hidden="true" />
            <span data-testid={`${testId}-views`}>{article.viewCount}</span>
          </div>
          {article.averageRating !== null && article.averageRating > 0 && (
            <div
              className="flex items-center gap-1"
              data-testid={`${testId}-rating`}
            >
              <Star
                className="h-3 w-3 fill-yellow-400 text-yellow-400"
                aria-hidden="true"
              />
              <span>{article.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, Star, User } from 'lucide-react';

import { formatDate, getFullName } from '@/shared/lib';
import { Article } from '@/shared/types';

export const ArticleHeader = ({ article }: { article: Article }) => {
  const authorName = article.author
    ? getFullName(article.author)
    : 'Unknown author';

  return (
    <header className="space-y-6">
      {/* Title */}
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl lg:text-6xl">
        {article.title}
      </h1>
      {/* Cover Image */}
      {article.coverImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        </div>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          {article.author && (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {authorName}
              </span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <time dateTime={article.createdAt?.toString()}>
            {formatDate(article.createdAt)}
          </time>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{article.viewCount.toLocaleString()} views</span>
        </div>
        {article.averageRating !== null && article.averageRating > 0 && (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{article.averageRating.toFixed(1)}</span>
            <span>({article.ratingCount} ratings)</span>
          </div>
        )}
      </div>

      {/* Category */}
      {article.category && (
        <Link
          href={`/category/${article.category.slug}`}
          className="inline-block"
        >
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-1 text-xs font-medium text-white transition-transform hover:scale-105">
            {article.category.name}
          </span>
        </Link>
      )}

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Link key={tag.id} href={`/tag/${tag.slug}`}>
              <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                #{tag.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

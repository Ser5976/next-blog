'use client';

import Image from 'next/image';
import Link from 'next/link';
import parse from 'html-react-parser';
import { CalendarDays } from 'lucide-react';

import { cn, formatDate } from '@/shared/lib';
import { Article } from '@/shared/types';

interface ArticleCardProps {
  article: Article;
  'data-testid'?: string;
  role?: string;
}

export const ArticleCardBig = ({
  article,
  'data-testid': dataTestId,
  role,
}: ArticleCardProps) => {
  const cardId = `article-${article.id}`;
  const testId = dataTestId || cardId;

  // Берем первые 4 строки текста (примерно 200 символов)
  const content = article.content.slice(0, 200) + '...';

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block"
      role={role || 'listitem'}
      data-testid={testId}
      aria-labelledby={`${cardId}-title`}
    >
      <article className="flex flex-col">
        {/* Изображение */}
        <div className="relative mb-5 aspect-[16/9] w-full overflow-hidden  bg-gray-100 dark:bg-gray-800">
          {article.coverImage ? (
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-testid={`${testId}-image`}
              priority={false}
            />
          ) : (
            <div
              className="flex h-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700"
              data-testid={`${testId}-no-image`}
            >
              <span className="text-gray-400 dark:text-gray-500">No image</span>
            </div>
          )}
        </div>

        {/* Контент карточки */}
        <div className="flex flex-col space-y-3">
          {/* Заголовок */}
          <h3
            id={`${cardId}-title`}
            className="mb-2 line-clamp-2 text-xl font-semibold leading-snug text-gray-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400"
            data-testid={`${testId}-title`}
          >
            {article.title}
          </h3>

          {/* Дата */}

          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            <span data-testid={`${testId}-date`}>
              {formatDate(article.createdAt)}
            </span>
          </div>

          {/* Текст - 4 строки */}
          <div
            className={cn(
              'prose prose-lg max-w-none dark:prose-invert',
              'prose-headings:scroll-mt-20 prose-headings:font-bold',
              'prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl',
              'prose-p:text-gray-700 dark:prose-p:text-gray-300',
              'prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline',
              'prose-img:rounded-xl prose-img:shadow-lg',
              'prose-pre:rounded-xl prose-pre:bg-gray-900',
              'prose-code:text-emerald-600 dark:prose-code:text-emerald-400',
              'prose-blockquote:border-l-emerald-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50'
            )}
            data-testid={`${testId}-content`}
          >
            {parse(content)}
          </div>

          {/* Теги / метаданные */}
          <div
            className="flex flex-wrap items-center gap-3 pt-2 text-sm text-gray-500 dark:text-gray-400"
            data-testid={`${testId}-meta`}
          >
            {article.tags && article.tags.length > 0 && (
              <>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <div className="flex flex-wrap gap-2">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      data-testid={`${testId}-tag-${tag.id}`}
                    >
                      #{tag.name}
                    </span>
                  ))}
                  {article.tags.length > 3 && (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      +{article.tags.length - 3}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

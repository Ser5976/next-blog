'use client';

import { memo, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FolderOpen } from 'lucide-react';

import { ArticlesResponse } from '@/entities/get-articles/model';
import { ArticleCardBig } from '@/shared/components';
import { Pagination, UniversalEmpty, UniversalError } from '@/shared/ui';

interface CategoryArticlesProps {
  articlesData: ArticlesResponse | null;
  currentPage: number;
  categorySlug: string;
  itemsPerPage: number;
}

export const CategoryArticles = memo(
  ({
    articlesData,
    currentPage,
    categorySlug,
    itemsPerPage,
  }: CategoryArticlesProps) => {
    const router = useRouter();
    const pathname = usePathname();

    // Оптимизированный обработчик пагинации
    const updatePage = useCallback(
      (page: number) => {
        const params = new URLSearchParams();

        // Добавляем page только если > 1
        if (page > 1) {
          params.set('page', String(page));
        }

        // Формируем URL
        const queryString = params.toString();
        const url = `${pathname}${queryString ? `?${queryString}` : ''}`;

        // Используем router.push вместо pushState
        router.push(url, { scroll: false });
      },
      [pathname, router]
    );

    // Мемоизируем список статей для предотвращения лишних перерендеров
    const articles = useMemo(() => {
      return articlesData?.articles || [];
    }, [articlesData?.articles]);

    // Мемоизируем количество статей
    const totalCount = useMemo(() => {
      return articlesData?.total || 0;
    }, [articlesData?.total]);

    // Мемоизируем общее количество страниц
    const totalPages = useMemo(() => {
      return articlesData?.totalPages || 0;
    }, [articlesData?.totalPages]);

    // Обработка ошибки
    if (!articlesData) {
      return (
        <UniversalError
          title="Failed to load articles"
          message={`Unable to load articles for category "${categorySlug}". Please try again later.`}
          variant="card"
        />
      );
    }

    // Обработка пустого состояния
    if (totalCount === 0) {
      return (
        <UniversalEmpty
          title="No articles yet"
          description="Check back soon for new content in this category."
          icon={<FolderOpen className="h-12 w-12" aria-hidden="true" />}
        />
      );
    }

    return (
      <div className="space-y-8">
        {/* Заголовок */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Articles in {categorySlug}
            </h1>
            <p className="text-muted-foreground mt-1">
              {totalCount} {totalCount === 1 ? 'article' : 'articles'} found
            </p>
          </div>
        </div>

        {/* Сетка статей */}
        <div
          className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2"
          role="list"
          aria-label="Category articles"
        >
          {articles.map((article) => (
            <ArticleCardBig
              key={article.slug || article.id}
              article={article}
              data-testid={`category-article-${article.id}`}
              role="listitem"
            />
          ))}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="pt-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={itemsPerPage}
              onPageChange={updatePage}
              data-testid="category-pagination"
            />
          </div>
        )}
      </div>
    );
  }
);

// Добавляем displayName для лучшей отладки
CategoryArticles.displayName = 'CategoryArticles';

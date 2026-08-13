'use client';

import { memo, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FolderOpen } from 'lucide-react';

import { ArticlesResponse } from '@/entities/get-articles/model';
import { ArticleCardBig } from '@/shared/components';
import { Pagination, UniversalEmpty, UniversalError } from '@/shared/ui';

interface TagArticlesProps {
  articlesData: ArticlesResponse | null;
  currentPage: number;
  tagSlug: string;
  itemsPerPage: number;
}

export const TagArticles = memo(
  ({ articlesData, currentPage, tagSlug, itemsPerPage }: TagArticlesProps) => {
    const router = useRouter();
    const pathname = usePathname();

    const updatePage = useCallback(
      (page: number) => {
        const params = new URLSearchParams();

        if (page > 1) {
          params.set('page', String(page));
        }

        const queryString = params.toString();
        const url = `${pathname}${queryString ? `?${queryString}` : ''}`;

        router.push(url, { scroll: false });
      },
      [pathname, router]
    );

    const articles = useMemo(() => {
      return articlesData?.articles || [];
    }, [articlesData?.articles]);

    const totalCount = useMemo(() => {
      return articlesData?.total || 0;
    }, [articlesData?.total]);

    const totalPages = useMemo(() => {
      return articlesData?.totalPages || 0;
    }, [articlesData?.totalPages]);

    if (!articlesData) {
      return (
        <UniversalError
          title="Failed to load articles"
          message={`Unable to load articles for tag "${tagSlug}". Please try again later.`}
          variant="card"
        />
      );
    }

    if (totalCount === 0) {
      return (
        <UniversalEmpty
          title="No articles yet"
          description="Check back soon for new content with this tag."
          icon={<FolderOpen className="h-12 w-12" aria-hidden="true" />}
        />
      );
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Articles tagged with #{tagSlug}
            </h1>
            <p className="text-muted-foreground mt-1">
              {totalCount} {totalCount === 1 ? 'article' : 'articles'} found
            </p>
          </div>
        </div>

        <div
          className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2"
          role="list"
          aria-label="Tag articles"
        >
          {articles.map((article) => (
            <ArticleCardBig
              key={article.slug || article.id}
              article={article}
              data-testid={`tag-article-${article.id}`}
              role="listitem"
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pt-4 border-t">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              itemsPerPage={itemsPerPage}
              onPageChange={updatePage}
              data-testid="tag-pagination"
            />
          </div>
        )}
      </div>
    );
  }
);

TagArticles.displayName = 'TagArticles';

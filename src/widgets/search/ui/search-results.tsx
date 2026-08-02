'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

import { useArticles } from '@/entities/get-articles';
import { SearchForm } from '@/features/search';
import { ArticleCardBig } from '@/shared/components';
import {
  Pagination,
  Subtitle,
  Title,
  UniversalEmpty,
  UniversalError,
} from '@/shared/ui';
import { SearchResultsSkeleton } from './search-results-skeleton';

const PAGE_SIZE = 3;

export const SearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = (searchParams.get('query') ?? '').trim();
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const { data, isLoading, isError, isFetching } = useArticles(
    {
      page,
      limit: PAGE_SIZE,
      search: query || undefined,
      published: true,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    { enabled: Boolean(query) }
  );

  const updatePage = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams();
      if (query) {
        params.set('query', query);
      }
      if (nextPage > 1) {
        params.set('page', String(nextPage));
      }
      const qs = params.toString();
      router.push(qs ? `/search?${qs}` : '/search');
    },
    [query, router]
  );

  return (
    <div data-testid="search-page">
      <section
        className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-emerald-950/40 dark:via-gray-950 dark:to-teal-950/30"
        aria-labelledby="search-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 before:absolute before:left-1/3 before:top-0 before:h-[320px] before:w-[320px] before:rounded-full before:bg-gradient-to-r before:from-emerald-400/15 before:to-teal-400/15 before:blur-3xl"
          aria-hidden="true"
        />
        <div className="container relative mx-auto max-w-3xl px-4 py-12 md:py-16">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              VitaFlow Blog
            </p>
            <Title as="h1" id="search-heading" className="text-4xl md:text-5xl">
              Search
            </Title>
            <Subtitle className="mx-auto mt-3 max-w-xl text-base">
              Find articles on nutrition, fitness, mental health, and balanced
              living.
            </Subtitle>
          </div>
          <SearchForm variant="page" />
        </div>
      </section>

      <section
        className="bg-gradient-to-b from-white to-gray-50 py-12 dark:from-gray-950 dark:to-gray-900 md:py-16"
        aria-labelledby="search-results-heading"
        data-testid="search-results"
      >
        <div className="container mx-auto max-w-7xl px-4">
          {!query ? (
            <UniversalEmpty
              title="Start searching"
              description="Enter a keyword above to find articles across the blog."
              icon={<Search className="h-12 w-12" aria-hidden="true" />}
              data-testid="search-prompt"
            />
          ) : isLoading ? (
            <SearchResultsSkeleton
              title="Searching..."
              subtitle={`Looking for articles matching “${query}”.`}
              limit={PAGE_SIZE}
            />
          ) : isError ? (
            <UniversalError
              title="Search failed"
              message="Something went wrong while searching articles. Please try again."
              variant="card"
            />
          ) : !data || data.articles.length === 0 ? (
            <UniversalEmpty
              searchQuery={query}
              title="No results found"
              searchMessage={(q) =>
                `No articles match “${q}”. Try a different keyword.`
              }
              data-testid="search-empty"
            />
          ) : (
            <>
              <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Title
                    as="h2"
                    id="search-results-heading"
                    className="text-2xl"
                  >
                    Results
                  </Title>
                  <Subtitle className="mt-1 text-base">
                    {data.total} {data.total === 1 ? 'article' : 'articles'} for
                    “{query}”{isFetching ? ' · updating…' : ''}
                  </Subtitle>
                </div>
              </div>

              <div
                className="grid gap-25 sm:grid-cols-1 lg:grid-cols-2"
                role="list"
                aria-label={`Search results for ${query}`}
                data-testid="search-results-list"
              >
                {data.articles.map((article) => (
                  <ArticleCardBig
                    key={article.id}
                    article={article}
                    data-testid={`search-article-${article.id}`}
                    role="listitem"
                  />
                ))}
              </div>

              {data.totalPages > 1 ? (
                <div className="mt-12">
                  <Pagination
                    currentPage={data.page}
                    totalPages={data.totalPages}
                    totalItems={data.total}
                    itemsPerPage={PAGE_SIZE}
                    onPageChange={updatePage}
                    data-testid="search-pagination"
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

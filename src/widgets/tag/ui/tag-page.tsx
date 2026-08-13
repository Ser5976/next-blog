import { notFound } from 'next/navigation';

import { getTagBySlug, getTagsServer } from '@/entities/dashboard-get-tags';
import { getArticlesServer } from '@/entities/get-articles';
import { ARTICLES_PER_PAGE } from '../constants';
import { TagArticles } from './tag-articles';
import { TagHeader } from './tag-header';
import { TagSidebar } from './tag-sidebar';

interface TagPageProps {
  slug: string;
  page: number;
}

export async function TagPage({ slug, page }: TagPageProps) {
  // Получаем информацию о теге
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  // Получаем все теги для сайдбара
  const allTags = await getTagsServer();

  // Получаем статьи тега
  const articlesData = await getArticlesServer({
    tag: slug,
    page,
    limit: ARTICLES_PER_PAGE,
    published: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Получаем популярные статьи для сайдбара
  const popularArticles = await getArticlesServer({
    tag: slug,
    page: 1,
    limit: 5,
    published: true,
    sortBy: 'viewCount',
    sortOrder: 'desc',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <TagHeader tag={tag} totalArticles={articlesData?.total || 0} />

      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TagArticles
              articlesData={articlesData}
              currentPage={page}
              tagSlug={slug}
              itemsPerPage={ARTICLES_PER_PAGE}
            />
          </div>

          <div className="lg:col-span-1">
            <TagSidebar
              allTags={allTags}
              popularArticles={popularArticles?.articles || []}
              currentTagSlug={slug}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

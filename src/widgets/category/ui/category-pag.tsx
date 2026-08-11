import { notFound } from 'next/navigation';

import { getCategoryBySlug } from '@/entities/category';
import { getArticlesServer } from '@/entities/get-articles';
import { ARTICLES_PER_PAGE } from '../constants';
import { CategoryArticles } from './category-articles';
import { CategoryHeader } from './category-header';
import { CategorySidebar } from './category-sidebar';

interface CategoryPageProps {
  slug: string;
  page: number;
}

export async function CategoryPage({ slug, page }: CategoryPageProps) {
  // Получаем информацию о категории
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  // Получаем статьи категории
  const articlesData = await getArticlesServer({
    category: slug,
    page,
    limit: ARTICLES_PER_PAGE,
    published: true,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Получаем популярные статьи для сайдбара
  const popularArticles = await getArticlesServer({
    category: slug,
    page: 1,
    limit: 5,
    published: true,
    sortBy: 'viewCount',
    sortOrder: 'desc',
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Hero секция категории */}
      <CategoryHeader
        category={category}
        totalArticles={articlesData?.total || 0}
      />

      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основной контент */}
          <div className="lg:col-span-2">
            <CategoryArticles
              articlesData={articlesData}
              currentPage={page}
              categorySlug={slug}
              itemsPerPage={ARTICLES_PER_PAGE}
            />
          </div>

          {/* Сайдбар */}
          <div className="lg:col-span-1">
            <CategorySidebar
              category={category}
              popularArticles={popularArticles?.articles || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

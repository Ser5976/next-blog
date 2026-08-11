import { Suspense } from 'react';

import { CategoryPage, CategoryPageSkeleton } from '@/widgets/category';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CategoryPageRoute({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryPage slug={slug} page={currentPage} />
    </Suspense>
  );
}

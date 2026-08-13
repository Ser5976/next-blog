import { Suspense } from 'react';

import { TagPage, TagPageSkeleton } from '@/widgets/tag';

interface TagPageRouteProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function TagPageRoute({
  params,
  searchParams,
}: TagPageRouteProps) {
  const { slug } = await params;
  const { page = '1' } = await searchParams;
  const currentPage = parseInt(page, 10) || 1;

  return (
    <Suspense fallback={<TagPageSkeleton />}>
      <TagPage slug={slug} page={currentPage} />
    </Suspense>
  );
}

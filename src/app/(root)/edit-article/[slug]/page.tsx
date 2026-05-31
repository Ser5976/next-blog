import { Suspense } from 'react';

import { EditArticle } from '@/features/edit-article';
import { LoadingScreen } from '@/shared/ui/loading-screen';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <Suspense
      fallback={
        <LoadingScreen
          title="Loading article..."
          text="Please wait while we fetch the article data"
        />
      }
    >
      <EditArticle slug={slug} />
    </Suspense>
  );
}

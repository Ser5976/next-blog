import { Suspense } from 'react';

import { LoadingScreen } from '@/shared/ui/loading-screen';
import { Article } from '@/widgets/article';

export default async function ArticlePage({
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
          text="Please wait while we fetch the article"
        />
      }
    >
      <Article slug={slug} />
    </Suspense>
  );
}

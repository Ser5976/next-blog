import { Suspense } from 'react';

import { ListSkeleton } from '@/shared/ui';
import { DashboardArticles } from '@/widgets/dashboard-articles';

export default function ArticlesPage() {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <DashboardArticles />
    </Suspense>
  );
}

import { Suspense } from 'react';

import { ListSkeleton } from '@/shared/ui';
import { DashboardTags } from '@/widgets/dashboard-tags';

export default function TagsPage() {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <DashboardTags />
    </Suspense>
  );
}

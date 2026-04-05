import { Suspense } from 'react';

import { ListSkeleton } from '@/shared/ui';
import { DashboardCategories } from '@/widgets/dashboard-catigories';

export default function CategoriesPage() {
  return (
    <Suspense fallback={<ListSkeleton />}>
      <DashboardCategories />
    </Suspense>
  );
}

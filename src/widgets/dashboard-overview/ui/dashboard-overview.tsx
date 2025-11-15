import { Suspense } from 'react';

import { SkeletonLoader } from '@/entities/stat-card';
import { PostsStats } from '@/features/posts-stats';
import { TimeFilter } from './time-filter';

export const DashboardOverview = ({
  timeRange,
}: {
  timeRange: 'week' | 'month' | 'year';
}) => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок и фильтры */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Control Panel</h1>
            <p className="text-muted-foreground mt-1">
              Analytics and content management VitaFlow Blog
            </p>
          </div>
          <TimeFilter initialPeriod={timeRange} />
        </div>
        {/* Основная статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Suspense fallback={<SkeletonLoader />}>
            <PostsStats />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

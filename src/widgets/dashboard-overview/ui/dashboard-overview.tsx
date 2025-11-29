import { Suspense } from 'react';

import { SkeletonLoader } from '@/entities/stat-card';
import { TimeFilter, TimeRageType } from '@/entities/time-range';
import { CommentsStats } from '@/features/comments-stats';
import { EfficiencyStats } from '@/features/efficiency';
import { PopularCategories } from '@/features/popular-categories';
import { PopularPosts } from '@/features/popular-post';
import { PostsStats } from '@/features/posts-stats';
import { RatingStats } from '@/features/rating-stats';
import { UsersStats } from '@/features/users-stats';
import { ViewsStats } from '@/features/view-stats';

export const DashboardOverview = ({
  timeRange,
}: {
  timeRange: TimeRageType;
}) => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Заголовок и фильтры */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Overview Panel
            </h1>
            <p className="text-muted-foreground mt-1">
              Analytics for VitaFlowBlog
            </p>
          </div>
          <TimeFilter initialPeriod={timeRange} />
        </div>
        {/* Основная статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Suspense fallback={<SkeletonLoader />}>
            <PostsStats timeRange={timeRange} />
          </Suspense>
          <Suspense fallback={<SkeletonLoader />}>
            <ViewsStats timeRange={timeRange} />
          </Suspense>
          <Suspense fallback={<SkeletonLoader />}>
            <RatingStats timeRange={timeRange} />
          </Suspense>
          <Suspense fallback={<SkeletonLoader />}>
            <CommentsStats timeRange={timeRange} />
          </Suspense>
          <Suspense fallback={<SkeletonLoader />}>
            <UsersStats timeRange={timeRange} />
          </Suspense>
          <Suspense fallback={<SkeletonLoader />}>
            <EfficiencyStats timeRange={timeRange} />
          </Suspense>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<SkeletonLoader />}>
            <PopularPosts timeRange={timeRange} />
          </Suspense>
          <Suspense fallback={<SkeletonLoader />}>
            <PopularCategories timeRange={timeRange} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

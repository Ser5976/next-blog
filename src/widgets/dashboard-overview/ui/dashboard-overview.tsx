import { Suspense } from 'react';

import { SkeletonLoader } from '@/entities/stat-card';
import { TimeFilter } from '@/entities/time-range';
import { CommentsStats } from '@/features/comments-stats';
import { EfficiencyStats } from '@/features/efficiency';
import { PopularCategories } from '@/features/popular-categories';
import { PopularPosts } from '@/features/popular-post';
import { PostsStats } from '@/features/posts-stats';
import { RatingStats } from '@/features/rating-stats';
import { UsersStats } from '@/features/users-stats';
import { ViewsStats } from '@/features/view-stats';
import { Subtitle, Title } from '@/shared/ui';
import { DASHBOARD_CONFIG, GRID_CONFIG } from '../lib';
import { DashboardOverviewProps } from '../model';

export const DashboardOverview = ({ timeRange }: DashboardOverviewProps) => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className={`${DASHBOARD_CONFIG.maxWidth} mx-auto space-y-6`}>
        {/* Заголовок и фильтры */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Title>{DASHBOARD_CONFIG.title}</Title>
            <Subtitle>{DASHBOARD_CONFIG.subtitle}</Subtitle>
          </div>
          <TimeFilter initialPeriod={timeRange} />
        </div>
        {/* Основная статистика */}
        <div
          className={`grid ${GRID_CONFIG.stats.mobile} ${GRID_CONFIG.stats.tablet} ${GRID_CONFIG.stats.desktop} gap-4`}
        >
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
        <div
          className={` grid ${GRID_CONFIG.sections.mobile} ${GRID_CONFIG.sections.desktop} gap-6`}
        >
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

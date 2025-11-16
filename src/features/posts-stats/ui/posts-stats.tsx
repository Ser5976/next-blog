import { FileText } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { TimeRageType } from '@/entities/time-range';
import { getPoststStats } from '../api';

export const PostsStats = async ({
  timeRange,
}: {
  timeRange: TimeRageType;
}) => {
  const stats = await getPoststStats(timeRange);
  console.log('stats', stats);
  if (!stats) return <ErrorMessage message="Something went wrong!" />;

  return (
    <StatCard
      title="Total articles"
      value={stats.totalPosts.current}
      icon={FileText}
      trend={stats.totalPosts.change}
      description={`${stats.publishedPosts.current} published`}
    />
  );
};

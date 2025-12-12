import { FileText } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { getPostsStats } from '../api';
import { IPostsStatsProps } from '../model';

export const PostsStats = async ({ timeRange }: IPostsStatsProps) => {
  const stats = await getPostsStats(timeRange);
  //console.log('stats', stats);
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

import { FileText } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { getPoststStats } from '../api';

export const PostsStats = async () => {
  const stats = await getPoststStats();
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

import { MessageSquare } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { getCommentsStats } from '../api';
import { ICommentsProps } from '../model';

export const CommentsStats = async ({ timeRange }: ICommentsProps) => {
  const stats = await getCommentsStats(timeRange);
  // console.log('stats', stats);
  if (!stats) return <ErrorMessage message="Something went wrong!" />;

  return (
    <StatCard
      title="Comments"
      value={stats.totalComments.current}
      icon={MessageSquare}
      trend={stats.totalComments.change}
      description="Community activity"
    />
  );
};

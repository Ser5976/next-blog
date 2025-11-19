import { MessageSquare } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { TimeRageType } from '@/entities/time-range';
import { getCommentsStats } from '../api';

export const CommentsStats = async ({
  timeRange,
}: {
  timeRange: TimeRageType;
}) => {
  const stats = await getCommentsStats(timeRange);
  console.log('stats', stats);
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

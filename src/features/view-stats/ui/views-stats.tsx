import { Eye } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { TimeRageType } from '@/entities/time-range';
import { getViewsStats } from '../api';

export const ViewsStats = async ({
  timeRange,
}: {
  timeRange: TimeRageType;
}) => {
  const stats = await getViewsStats(timeRange);
  //console.log('stats', stats);
  if (!stats) return <ErrorMessage message="Something went wrong!" />;

  return (
    <StatCard
      title="Views"
      value={stats.totalViews.current}
      icon={Eye}
      trend={stats.totalViews.change}
      description="For all the time"
    />
  );
};

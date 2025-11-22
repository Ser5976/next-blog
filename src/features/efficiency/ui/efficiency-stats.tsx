import { TrendingUp } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { TimeRageType } from '@/entities/time-range';
import { getEfficiencyStats } from '../api';

export const EfficiencyStats = async ({
  timeRange,
}: {
  timeRange: TimeRageType;
}) => {
  const stats = await getEfficiencyStats(timeRange);
  console.log('stats', stats);
  if (!stats) return <ErrorMessage message="Something went wrong!" />;

  return (
    <StatCard
      title="Efficiency"
      value={stats.efficiency.current}
      icon={TrendingUp}
      trend={stats.efficiency.change}
      description="Published from the total number"
    />
  );
};

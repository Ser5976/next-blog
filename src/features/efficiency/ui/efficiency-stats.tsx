import { TrendingUp } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { getEfficiencyStats } from '../api';
import { IEfficiencyProps } from '../model';

export const EfficiencyStats = async ({ timeRange }: IEfficiencyProps) => {
  const stats = await getEfficiencyStats(timeRange);
  // console.log('stats', stats);
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

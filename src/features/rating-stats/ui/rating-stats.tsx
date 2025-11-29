import { Star } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { getRatingStats } from '../api';
import { IRatingStatsProps } from '../model';

export const RatingStats = async ({ timeRange }: IRatingStatsProps) => {
  const stats = await getRatingStats(timeRange);
  //console.log('stats', stats);
  if (!stats) return <ErrorMessage message="Something went wrong!" />;

  return (
    <StatCard
      title="Average rating"
      value={stats.averageRating.current}
      icon={Star}
      trend={stats.averageRating.change}
      description="Based on user ratings"
    />
  );
};

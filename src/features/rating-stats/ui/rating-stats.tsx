import { Star } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { TimeRageType } from '@/entities/time-range';
import { getRatingStats } from '../api';

export const RatingStats = async ({
  timeRange,
}: {
  timeRange: TimeRageType;
}) => {
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

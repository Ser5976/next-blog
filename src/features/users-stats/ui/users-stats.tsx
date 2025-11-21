import { Users } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { TimeRageType } from '@/entities/time-range';
import { getUsersStats } from '../api';

export const UsersStats = async ({
  timeRange,
}: {
  timeRange: TimeRageType;
}) => {
  const stats = await getUsersStats(timeRange);
  console.log('stats', stats);
  if (!stats) return <ErrorMessage message="Something went wrong!" />;

  return (
    <StatCard
      title="Users"
      value={stats.totalUsers.current}
      icon={Users}
      trend={stats.totalUsers.change}
      description="Registered readers"
    />
  );
};

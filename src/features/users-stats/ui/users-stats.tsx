import { Users } from 'lucide-react';

import { ErrorMessage, StatCard } from '@/entities/stat-card';
import { getUsersStats } from '../api';
import { IUsersStatsProps } from '../model';

export const UsersStats = async ({ timeRange }: IUsersStatsProps) => {
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

import { TimeRageType } from '@/entities/time-range';

export interface IUsersStats {
  totalUsers: { current: number; previous: number; change: number };
}
export interface IUsersStatsProps {
  timeRange: TimeRageType;
}

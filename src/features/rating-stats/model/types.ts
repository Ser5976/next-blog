import { TimeRageType } from '@/entities/time-range';

export interface IRatingStats {
  averageRating: { current: number; previous: number; change: number };
  totalRatings: { current: number; previous: number; change: number };
}
export interface IRatingStatsProps {
  timeRange: TimeRageType;
}

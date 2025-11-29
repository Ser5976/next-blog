import { TimeRageType } from '@/entities/time-range';

export interface IEfficiencyStats {
  efficiency: { current: number; previous: number; change: number };
  publishedRatio: { current: number; previous: number; change: number };
  totalPosts: { current: number; previous: number; change: number };
}

export interface IEfficiencyProps {
  timeRange: TimeRageType;
}

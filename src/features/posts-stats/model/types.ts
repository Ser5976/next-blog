import { TimeRageType } from '@/entities/time-range';

export interface IPostsStats {
  totalPosts: { current: number; previous: number; change: number };
  publishedPosts: { current: number; previous: number; change: number };
}
export interface IPostsStatsProps {
  timeRange: TimeRageType;
}

import { TimeRageType } from '@/entities/time-range';

export interface IPopularPosts {
  id: string;
  title: string;
  views: number;
  rating: number;
  commentCount: number;
  published: boolean;
  publishedAt: Date | null;
}
export interface IPopularPostsProps {
  timeRange: TimeRageType;
}

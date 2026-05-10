import { TimeRageType } from '@/entities/time-range';

export type AuthorOverviewProps = {
  timeRange: TimeRageType;
};

export type AuthorStatsResponse = {
  current: {
    posts: number;
    publishedPosts: number;
    comments: number;
    totalViews: number;
  };
  previous: {
    posts: number;
    publishedPosts: number;
    comments: number;
    totalViews: number;
  };
  changes: {
    posts: number;
    publishedPosts: number;
    comments: number;
    totalViews: number;
  };
};

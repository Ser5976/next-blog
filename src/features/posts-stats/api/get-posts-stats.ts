import { TimeRageType } from '@/entities/time-range';
import { IPostsStats } from '../model';

export const getPoststStats = async (
  timeRange: TimeRageType
): Promise<IPostsStats | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/posts?timeRage=${timeRange}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error('Failed to fetch data');
    return null;
  }
  const postStats = await res.json();
  return postStats;
};

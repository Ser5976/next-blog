import { TimeRageType } from '@/entities/time-range';
import { IPopularPosts } from '../model';

export const getPopularPosts = async (
  timeRange: TimeRageType
): Promise<IPopularPosts[] | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/popular-posts?timeRange=${timeRange}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error('Failed to fetch data');
    return null;
  }
  const popularPosts = await res.json();
  return popularPosts;
};

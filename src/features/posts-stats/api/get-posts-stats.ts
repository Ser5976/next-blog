import { TimeRageType } from '@/entities/time-range';
import { IPostsStats } from '../model';

export const getPostsStats = async (
  timeRange: TimeRageType
): Promise<IPostsStats | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/posts?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch posts stats: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Network error fetching posts stats:', error);
    return null;
  }
};

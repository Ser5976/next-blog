import { TimeRageType } from '@/entities/time-range';
import { IPopularPosts } from '../model';

export const getPopularPosts = async (
  timeRange: TimeRageType
): Promise<IPopularPosts[] | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/popular-posts?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch popular posts: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Network error fetching popular posts:', error);
    return null;
  }
};

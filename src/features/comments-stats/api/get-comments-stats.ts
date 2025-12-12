import { TimeRageType } from '@/entities/time-range';
import { ICommentsStats } from '../model';

export const getCommentsStats = async (
  timeRange: TimeRageType
): Promise<ICommentsStats | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/comments?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch comments stats: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Network error fetching comments stats:', error);
    return null;
  }
};

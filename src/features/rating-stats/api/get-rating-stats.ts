import { TimeRageType } from '@/entities/time-range';
import { IRatingStats } from '../model';

export const getRatingStats = async (
  timeRange: TimeRageType
): Promise<IRatingStats | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/ratings?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch rating stats: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Network error fetching rating stats:', error);
    return null;
  }
};

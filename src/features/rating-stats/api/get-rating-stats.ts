import { TimeRageType } from '@/entities/time-range';
import { IRatingStats } from '../model';

export const getRatingStats = async (
  timeRange: TimeRageType
): Promise<IRatingStats | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/ratings?timeRange=${timeRange}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error('Failed to fetch data');
    return null;
  }
  const ratingStats = await res.json();
  return ratingStats;
};

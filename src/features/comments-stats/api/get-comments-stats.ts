import { TimeRageType } from '@/entities/time-range';
import { ICommentsStats } from '../model';

export const getCommentsStats = async (
  timeRange: TimeRageType
): Promise<ICommentsStats | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/comments?timeRange=${timeRange}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error('Failed to fetch data');
    return null;
  }
  const commentsStats = await res.json();
  return commentsStats;
};

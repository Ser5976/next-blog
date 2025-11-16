import { TimeRageType } from '@/entities/time-range';
import { IViewStats } from '../model';

export const getViewsStats = async (
  timeRange: TimeRageType
): Promise<IViewStats | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/total-views?timeRage=${timeRange}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error('Failed to fetch data');
    return null;
  }
  const viewsStats = await res.json();
  return viewsStats;
};

import { TimeRageType } from '@/entities/time-range';
import { IViewStats } from '../model';

export const getViewsStats = async (
  timeRange: TimeRageType
): Promise<IViewStats | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/total-views?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch views stats: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Network error fetching views stats:', error);
    return null;
  }
};

import { TimeRageType } from '@/entities/time-range';
import { IEfficiencyStats } from '../model';

export const getEfficiencyStats = async (
  timeRange: TimeRageType
): Promise<IEfficiencyStats | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/efficiency?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch efficiency stats: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Network error fetching efficiency stats:', error);
    return null;
  }
};

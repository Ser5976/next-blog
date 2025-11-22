import { TimeRageType } from '@/entities/time-range';
import { IEfficiencyStats } from '../model';

export const getEfficiencyStats = async (
  timeRange: TimeRageType
): Promise<IEfficiencyStats | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/efficiency?timeRange=${timeRange}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error('Failed to fetch data');
    return null;
  }
  const efficiencyStats = await res.json();
  return efficiencyStats;
};

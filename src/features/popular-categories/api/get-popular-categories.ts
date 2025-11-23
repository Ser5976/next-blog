import { TimeRageType } from '@/entities/time-range';
import { IPopularCategories } from '../model';

export const getPopularCategories = async (
  timeRange: TimeRageType
): Promise<IPopularCategories[] | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/popular-categories?timeRange=${timeRange}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error('Failed to fetch data');
    return null;
  }
  const popularCategories = await res.json();
  return popularCategories;
};

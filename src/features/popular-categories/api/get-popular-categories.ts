import { TimeRageType } from '@/entities/time-range';
import { IPopularCategories } from '../model';

export const getPopularCategories = async (
  timeRange: TimeRageType
): Promise<IPopularCategories[] | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/popular-categories?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch popular categories: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Network error fetching popular categories:', error);
    return null;
  }
};

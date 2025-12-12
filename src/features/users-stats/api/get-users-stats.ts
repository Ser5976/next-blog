import { TimeRageType } from '@/entities/time-range';
import { IUsersStats } from '../model';

export const getUsersStats = async (
  timeRange: TimeRageType
): Promise<IUsersStats | null> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/users?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error(
        `Failed to fetch users stats: ${res.status} ${res.statusText}`
      );
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Network error fetching users stats:', error);
    return null;
  }
};

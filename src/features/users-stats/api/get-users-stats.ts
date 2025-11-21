import { TimeRageType } from '@/entities/time-range';
import { IUsersStats } from '../model';

export const getUsersStats = async (
  timeRange: TimeRageType
): Promise<IUsersStats | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/users?timeRange=${timeRange}`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error('Failed to fetch data');
    return null;
  }
  const usersStats = await res.json();
  return usersStats;
};

import { IPostsStats } from '../model';

export const getPoststStats = async (): Promise<IPostsStats | null> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/dashboard/posts`,
    {
      next: { revalidate: 60 },
    }
  );
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error('Failed to fetch data');
    return null;
  }
  const postStats = await res.json();
  return postStats;
};

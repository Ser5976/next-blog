import { IPostsStats } from '../model';

export const statsItems = (stats: IPostsStats) => {
  return [
    {
      value: stats.totalPosts,
      label: 'Total Posts',
      testId: 'total-posts-stat',
      ariaLabel: `Total posts: ${stats.totalPosts}`,
    },
    {
      value: stats.publishedPosts,
      label: 'Published',
      testId: 'published-posts-stat',
      ariaLabel: `Published posts: ${stats.publishedPosts}`,
    },
    {
      value: stats.totalViews.toLocaleString(),
      label: 'Total Views',
      testId: 'total-views-stat',
      ariaLabel: `Total views: ${stats.totalViews.toLocaleString()}`,
    },
    {
      value: stats.averageRating.toFixed(1),
      label: 'Avg Rating',
      testId: 'avg-rating-stat',
      ariaLabel: `Average rating: ${stats.averageRating.toFixed(1)}`,
    },
    {
      value: stats.totalRatings,
      label: 'Total Ratings',
      testId: 'total-ratings-stat',
      ariaLabel: `Total ratings: ${stats.totalRatings}`,
    },
  ] as const;
};

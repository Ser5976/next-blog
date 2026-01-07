import { ICommentsStats } from '../model';

export interface StatsItem {
  value: string | number;
  label: string;
  testId: string;
  ariaLabel: string;
}

export function commentsStatsItems(stats: ICommentsStats): StatsItem[] {
  return [
    {
      value: stats.totalComments.toLocaleString(),
      label: 'Total Comments',
      testId: 'total-comments',
      ariaLabel: `Total comments: ${stats.totalComments}`,
    },
    {
      value: stats.totalLikes.toLocaleString(),
      label: 'Total Likes',
      testId: 'total-likes',
      ariaLabel: `Total likes on comments: ${stats.totalLikes}`,
    },
    {
      value: stats.totalDislikes.toLocaleString(),
      label: 'Total Dislikes',
      testId: 'total-dislikes',
      ariaLabel: `Total dislikes on comments: ${stats.totalDislikes}`,
    },
    {
      value: stats.postsCommented.toLocaleString(),
      label: 'Posts Commented',
      testId: 'posts-commented',
      ariaLabel: `Number of posts commented on: ${stats.postsCommented}`,
    },
  ];
}

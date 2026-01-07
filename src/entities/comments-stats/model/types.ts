export interface ICommentsStats {
  totalComments: number;
  totalDislikes: number;
  totalLikes: number;
  postsCommented: number;
}

export interface CommentsStatsProps {
  stats: ICommentsStats;
}

export interface IPostsStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  averageRating: number;
  totalRatings: number;
}

export interface PostsStatsProps {
  stats: IPostsStats;
}

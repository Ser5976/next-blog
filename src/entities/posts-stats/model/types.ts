export interface PostsStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  averageRating: number;
  totalRatings: number;
}

export interface PostsStatsProps {
  stats: PostsStats;
}

import { Article } from '@/shared/types';

// Основной response для постов
export interface UserPostsResponse {
  success: boolean;
  posts: Article[];
  stats: IPostsStats;
  message?: string;
}
export interface PostRowProps {
  post: Article;
  onDelete: (postId: string) => void;
  isDeleting?: boolean;
}
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

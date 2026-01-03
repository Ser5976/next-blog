import { Post } from '@/entities/post-row';
import { IPostsStats } from '@/entities/posts-stats';

// Основной response для постов
export interface UserPostsResponse {
  success: boolean;
  posts: Post[];
  stats: IPostsStats;
  message?: string;
}

import { IPostsStats } from '@/entities/posts-stats';
import { Article } from '@/shared/types';

// Основной response для постов
export interface UserPostsResponse {
  success: boolean;
  posts: Article[];
  stats: IPostsStats;
  message?: string;
}

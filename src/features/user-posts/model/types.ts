import { Post } from '@/entities/post-row';
import { PostsStats } from '@/entities/posts-stats';

// Основной response для постов
export interface UserPostsResponse {
  success: boolean;
  posts: Post[];
  stats: PostsStats;
  message?: string;
}

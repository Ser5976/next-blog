import { Comment } from '@/entities/coment-row';
import { ICommentsStats } from '@/entities/comments-stats';

export interface UserCommentsResponse {
  success: boolean;
  comments: Comment[];
  stats: ICommentsStats;
  message?: string;
}

export interface DeleteCommentResponse {
  success: boolean;
  message: string;
}

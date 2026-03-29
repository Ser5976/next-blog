import { ICommentsStats } from '@/entities/comments-stats';

export interface Comment {
  id: string;
  content: string;
  createdAt: Date | string;
  post: {
    id: string;
    title: string;
    slug: string;
    published: boolean;
  };
  stats: {
    likesCount: number;
    dislikesCount: number;
  };
}
// Пропсы для компонентов
export interface CommentRowProps {
  comment: Comment;
  onDelete: (commentId: string, content: string) => void;
  isDeleting?: boolean;
}

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

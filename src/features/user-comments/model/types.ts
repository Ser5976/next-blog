import { Comment } from '@/shared/types';

// Пропсы для компонентов
export interface CommentRowProps {
  comment: Comment;
  onDelete: (commentId: string, content: string) => void;
  onEdit: (commentId: string, content: string) => void;
  isDeleting?: boolean;
  isEditing?: boolean;
  isSheetForm: boolean;
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

export interface UpdateCommentResponse {
  success: boolean;
  message: string;
  comment: {
    id: string;
    content: string;
  };
}
export interface ICommentsStats {
  totalComments: number;
  totalDislikes: number;
  totalLikes: number;
  postsCommented: number;
}

export interface CommentsStatsProps {
  stats: ICommentsStats;
}

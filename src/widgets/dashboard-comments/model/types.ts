import { User } from '@/features/user-profile-info';

// Фильтры для поиска комментариев
export interface CommentsFilters {
  page: number;
  limit: number;
  search?: string; // Поиск по содержимому, автору, посту
}

// Расширенный тип комментария для dashboard
export interface DashboardComment {
  id: string;
  content: string;
  createdAt: number | null; // timestamp
  updatedAt: number | null; // timestamp
  author: User | null;
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

// Ответ API для списка комментариев
export interface CommentsResponse {
  success: boolean;
  comments: DashboardComment[];
  total: number;
  page: number;
  totalPages: number;
  message?: string;
}

// Параметры удаления комментария
export interface DeleteCommentParams {
  commentId: string;
}

// Общий ответ API
export interface ApiResponse {
  success: boolean;
  message: string;
}

// Props для CommentRow
export interface CommentRowProps {
  comment: DashboardComment;
  onDelete: (commentId: string, content: string) => void;
  isEditing?: boolean;
  isDeleting?: boolean;
}

// Props для CommentsFilters
export interface CommentsFiltersProps {
  filters: CommentsFilters;
  onFiltersChange: (filters: CommentsFilters) => void;
}

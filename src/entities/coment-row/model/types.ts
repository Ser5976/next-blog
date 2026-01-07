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

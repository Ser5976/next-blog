import { Article } from '@/shared/types';

export interface PostRowProps {
  post: Article;
  onDelete: (postId: string) => void;
  isDeleting?: boolean;
}

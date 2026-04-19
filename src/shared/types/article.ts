import { ArticleFormValues } from '../schemas';
import { UserClerk } from './user-clerk';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  authorId: string | null;
  author?: UserClerk | null;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  comments: {
    id: string;
    content: string;
    likes: number;
    dislikes: number;
  }[];
  viewCount: number;
  averageRating: number | null;
  ratingCount: number;
  createdAt: number | null;
  updatedAt: number | null;
  publishedAt: number | null;
}
export interface ArticleFormProps {
  initialData?: ArticleFormValues;
  onSubmit: (data: ArticleFormValues) => Promise<void>;
  isSubmitting?: boolean;
  categories?: { id: string; name: string; slug: string }[];
  availableTags?: { id: string; name: string; slug: string }[];
}
export interface ApiResponse {
  success: boolean;
  message?: string;
}

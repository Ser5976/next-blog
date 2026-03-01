import { User } from '@/features/user-profile-info';
import { ArticleFormValues } from './schemas';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  authorId: string | null;
  author?: User | null;
  categoryId: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
  viewCount: number;
  averageRating: number | null;
  ratingCount: number;
  createdAt: number | null;
  updatedAt: number | null;
  publishedAt: number | null;
}

export interface ArticlesFilters {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  tag?: string;
  published?: boolean;
  sortBy?:
    | 'createdAt'
    | 'updatedAt'
    | 'publishedAt'
    | 'viewCount'
    | 'averageRating';
  sortOrder?: 'asc' | 'desc';
}

export interface ArticlesResponse {
  success: boolean;
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
  message?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export interface ArticleRowProps {
  article: Article;
  onEdit: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onTogglePublish: (id: string, published: boolean) => void;
  isEditing?: boolean;
  isDeleting?: boolean;
  isToggling?: boolean;
}

export interface ArticlesFiltersProps {
  filters: ArticlesFilters;
  onFiltersChange: (filters: ArticlesFilters) => void;
  categories?: { id: string; name: string; slug: string }[];
  tags?: { id: string; name: string; slug: string }[];
}

export interface ArticleFormProps {
  initialData?: ArticleFormValues;
  onSubmit: (data: ArticleFormValues) => Promise<void>;
  isSubmitting?: boolean;
  categories?: { id: string; name: string; slug: string }[];
  availableTags?: { id: string; name: string; slug: string }[];
}

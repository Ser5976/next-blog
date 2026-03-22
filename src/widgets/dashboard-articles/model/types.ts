import { Article } from '@/shared/types';
import { ArticleFormValues } from './schemas';

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

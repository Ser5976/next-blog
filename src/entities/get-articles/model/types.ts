import { Article } from '@/shared/types';

export interface ArticlesResponse {
  success: boolean;
  articles: Article[];
  total: number;
  page: number;
  totalPages: number;
  message?: string;
}

import { ArticlesFilters } from '@/shared/api';

export interface HomeArticlesSectionProps {
  id?: string;
  title: string;
  subtitle: string;
  filters: Omit<ArticlesFilters, 'page' | 'limit'>;
  limit?: number;
}

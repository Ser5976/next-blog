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

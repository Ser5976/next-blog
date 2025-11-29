import { TimeRageType } from '@/entities/time-range';

export interface IPopularCategories {
  name: string;
  postCount: number;
  totalViews: number;
  viewsPercentage: number;
}

export interface IPopularCategoriesProps {
  timeRange: TimeRageType;
}

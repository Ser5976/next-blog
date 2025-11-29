import { TrendingUp } from 'lucide-react';

import { ErrorMessage } from '@/entities/stat-card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { getPopularCategories } from '../api';
import { IPopularCategoriesProps } from '../model';

export const PopularCategories = async ({
  timeRange,
}: IPopularCategoriesProps) => {
  const popularCategories = await getPopularCategories(timeRange);
  // console.log('popularCategories', popularCategories);
  if (!popularCategories)
    return <ErrorMessage message="Something went wrong!" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Popular categories
        </CardTitle>
        <CardDescription>Distribution by topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="space-y-4"
          role="list"
          aria-label="Popular categories statistics"
        >
          {popularCategories.map((category, index) => (
            <div
              key={category.name}
              className="space-y-2"
              role="listitem"
              aria-label={`Category: ${category.name}`}
              aria-posinset={index + 1}
              aria-setsize={popularCategories.length}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{category.name}</span>
                <span className="text-sm text-muted-foreground">
                  {category.postCount} articles
                </span>
              </div>
              <div
                className="w-full bg-secondary rounded-full h-2"
                role="progressbar"
                aria-valuenow={category.viewsPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Views percentage for ${category.name}`}
              >
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${category.viewsPercentage}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{category.totalViews.toLocaleString()} views</span>
                <span>{category.viewsPercentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

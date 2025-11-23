import { BarChart3, Eye, MessageSquare, Star } from 'lucide-react';

import { ErrorMessage } from '@/entities/stat-card';
import { TimeRageType } from '@/entities/time-range';
import { Badge } from '@/shared/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { getPopularPosts } from '../api';

export const PopularPosts = async ({
  timeRange,
}: {
  timeRange: TimeRageType;
}) => {
  const popularPosts = await getPopularPosts(timeRange);
  //console.log('popularPosts', popularPosts);
  if (!popularPosts) return <ErrorMessage message="Something went wrong!" />;

  return (
    <Card
      aria-labelledby="popular-posts-title"
      aria-describedby="popular-posts-description"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2" id="popular-posts-title">
          <BarChart3 className="h-5 w-5" aria-hidden="true" />
          Popular articles
        </CardTitle>
        <CardDescription id="popular-posts-description">
          Articles with the most views
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="space-y-4"
          role="list"
          aria-label="Popular articles list"
        >
          {popularPosts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-3 rounded-lg border"
              role="listitem"
              aria-labelledby={`post-title-${post.id}`}
            >
              <div className="flex-1 min-w-0">
                <h4
                  className="font-medium text-sm truncate"
                  id={`post-title-${post.id}`}
                >
                  {post.title}
                </h4>
                <div
                  className="flex items-center gap-4 mt-1 text-xs text-muted-foreground"
                  aria-label="Post statistics"
                >
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" aria-hidden="true" />
                    <span aria-label={`Views: ${post.views.toLocaleString()}`}>
                      {post.views.toLocaleString()}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" aria-hidden="true" />
                    <span aria-label={`Rating: ${post.rating}`}>
                      {post.rating}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" aria-hidden="true" />
                    <span aria-label={`Comments: ${post.commentCount}`}>
                      {post.commentCount}
                    </span>
                  </span>
                </div>
              </div>
              <Badge
                variant={post.published ? 'default' : 'secondary'}
                aria-label={post.published ? 'Published' : 'Draft'}
              >
                {post.published ? 'Published' : 'Draft'}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

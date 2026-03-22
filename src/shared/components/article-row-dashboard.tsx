'use client';

import Image from 'next/image';
import {
  Calendar,
  Eye,
  FileText,
  MessageCircle,
  Star,
  Tag,
  User,
} from 'lucide-react';

import { formatDate, getFullName } from '@/shared/lib';
import { Badge } from '@/shared/ui/badge';
import { Article } from '../types';

export const ArticleRowDashboard = ({ article }: { article: Article }) => {
  const authorName = article.author
    ? getFullName(article.author)
    : 'Unknown author';

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Cover Image */}
      <div className="relative flex-shrink-0 w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden bg-muted">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title and Status */}
        <div className=" flex gap-2 mb-2">
          <h3 className="font-medium text-foreground break-words flex-1 min-w-0">
            {article.title}
          </h3>
          <Badge
            variant={article.published ? 'default' : 'secondary'}
            className="flex-shrink-0"
          >
            {article.published ? 'Published' : 'Draft'}
          </Badge>
        </div>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {article.excerpt}
          </p>
        )}

        {/* Metadata - Responsive grid */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground mb-3">
          {/* Author */}
          {article.author && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3 flex-shrink-0" />
              <span className="truncate max-w-[120px] sm:max-w-none">
                {authorName}
              </span>
            </span>
          )}

          {/* Category */}
          {article.category && (
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3 flex-shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-none">
                {article.category.name}
              </span>
            </span>
          )}

          {/* Created Date */}
          {article.createdAt && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              {formatDate(article.createdAt)}
            </span>
          )}

          {/* Views */}
          <span className="flex items-center gap-1 whitespace-nowrap">
            <Eye className="h-3 w-3 flex-shrink-0" />
            {article.viewCount.toLocaleString()}
          </span>

          {/* Comments */}
          <span
            className="flex items-center gap-1 whitespace-nowrap"
            aria-label={`${article.comments.length} comments`}
            data-testid="post-comments"
          >
            <MessageCircle
              className="h-3.5 w-3.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span>{article.comments.length}</span>
          </span>

          {/* Rating */}
          {article.averageRating ? (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              {article.averageRating.toFixed(1)} ({article.ratingCount})
            </span>
          ) : null}
        </div>

        {/* Tags - Responsive wrapping */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.map((tag) => (
              <Badge key={tag.id} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

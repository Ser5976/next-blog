'use client';

import { memo, useCallback } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Eye,
  FileText,
  Loader2,
  MoreVertical,
  Pencil,
  Star,
  Tag,
  Trash2,
  User,
} from 'lucide-react';

import { formatDate, getFullName } from '@/shared/lib';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Switch } from '@/shared/ui/switch';
import { ArticleRowProps } from '../model';

const ArticleRowComponent = ({
  article,
  onEdit,
  onDelete,
  onTogglePublish,
  isEditing = false,
  isDeleting = false,
  isToggling = false,
}: ArticleRowProps) => {
  const handleDelete = useCallback(() => {
    if (isEditing || isDeleting) return;
    onDelete(article.id, article.title);
  }, [article.id, article.title, isEditing, isDeleting, onDelete]);

  const handleEdit = useCallback(() => {
    if (isEditing || isDeleting) return;
    onEdit(article.id);
  }, [article.id, isEditing, isDeleting, onEdit]);

  const handleTogglePublish = useCallback(() => {
    if (isToggling) return;
    onTogglePublish(article.id, !article.published);
  }, [article.id, article.published, isToggling, onTogglePublish]);

  const isDisabled = isEditing || isDeleting || isToggling;
  const authorName = article.author
    ? getFullName(article.author)
    : 'Unknown author';

  return (
    <div
      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
      role="row"
      aria-label={`Article: ${article.title}`}
      aria-busy={isDisabled}
      data-testid={`article-row-${article.id}`}
    >
      {/* Cover Image */}
      <div className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* Title and Status */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground truncate max-w-[400px]">
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
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {article.excerpt}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {/* Author */}
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {authorName}
              </span>

              {/* Category */}
              {article.category && (
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {article.category.name}
                </span>
              )}

              {/* Created Date */}
              {article.createdAt && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(article.createdAt)}
                </span>
              )}

              {/* Views */}
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {article.viewCount.toLocaleString()}
              </span>

              {/* Rating */}
              {article.averageRating ? (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {article.averageRating.toFixed(1)} ({article.ratingCount})
                </span>
              ) : null}
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {article.tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Publish Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={article.published}
                onCheckedChange={handleTogglePublish}
                disabled={isToggling}
                aria-label={`Toggle publish status for ${article.title}`}
              />
              {isToggling && (
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDisabled}
                  className="h-8 w-8"
                  aria-label={`Actions for ${article.title}`}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MoreVertical className="h-4 w-4" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleEdit}
                  disabled={isDisabled}
                  className="cursor-pointer"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDisabled}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ArticleRow = memo(ArticleRowComponent);
ArticleRow.displayName = 'ArticleRow';

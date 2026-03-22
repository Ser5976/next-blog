'use client';

import { memo, useCallback } from 'react';
import { Loader2, MoreVertical, Pencil, Trash2 } from 'lucide-react';

import { ArticleRowDashboard } from '@/shared/components/article-row-dashboard';
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

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
      role="row"
      aria-label={`Article: ${article.title}`}
      aria-busy={isDisabled}
      data-testid={`article-row-${article.id}`}
    >
      {/* Article Content - Takes full width on mobile */}
      <div className="flex-1 min-w-0">
        <ArticleRowDashboard article={article} />
      </div>

      {/* Actions - Stays at top on mobile, aligns with content on desktop */}
      <div className="flex items-center justify-end sm:justify-start gap-2 flex-shrink-0">
        {/* Publish Toggle */}
        <div className="flex items-center gap-2 ">
          <Switch
            checked={article.published}
            onCheckedChange={handleTogglePublish}
            disabled={isToggling}
            aria-label={`Toggle publish status for ${article.title}`}
            className="cursor-pointer"
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
              className="h-8 w-8 cursor-pointer"
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
  );
};

export const ArticleRow = memo(ArticleRowComponent);
ArticleRow.displayName = 'ArticleRow';

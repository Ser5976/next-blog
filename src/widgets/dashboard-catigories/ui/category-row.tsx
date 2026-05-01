'use client';

import { memo, useCallback } from 'react';
import { ChartColumnStacked, MoreVertical, Pencil, Trash2 } from 'lucide-react';

import { Category } from '@/entities/dashboard-get-categories/model';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface CategoryRowProps {
  category: Category;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  isDeleting?: boolean;
}

const CategoryRowComponent = ({
  category,
  onEdit,
  onDelete,
  isDeleting = false,
}: CategoryRowProps) => {
  const handleDelete = useCallback(() => {
    if (isDeleting) return;
    onDelete(category.id, category.name);
  }, [category.id, category.name, isDeleting, onDelete]);

  const handleEdit = useCallback(() => {
    if (isDeleting) return;
    onEdit(category.id);
  }, [category.id, isDeleting, onEdit]);

  const hasPosts = (category._count?.posts || 0) > 0;

  return (
    <div
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
      role="row"
      aria-label={`Category: ${category.name}`}
      aria-busy={isDeleting}
      aria-disabled={isDeleting}
      data-testid={`category-row-${category.id}`}
      data-category-id={category.id}
      data-category-name={category.name}
      data-category-slug={category.slug}
      data-category-posts-count={category._count?.posts || 0}
      data-deleting={isDeleting}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <ChartColumnStacked
          className="h-5 w-5 text-muted-foreground flex-shrink-0"
          aria-hidden="true"
          data-testid="category-icon"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium truncate" data-testid="category-name">
              {category.name}
            </h3>
            <Badge
              variant="secondary"
              className="text-xs"
              data-testid="category-posts-badge"
              aria-label={`${category._count?.posts || 0} posts in this category`}
            >
              {category._count?.posts || 0} posts
            </Badge>
          </div>
          <p
            className="text-sm text-muted-foreground mt-1"
            data-testid="category-slug"
          >
            /{category.slug}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isDeleting}
              className="h-8 w-8 cursor-pointer"
              aria-label={`Actions for ${category.name}`}
              aria-expanded={undefined}
              data-testid={`category-actions-trigger-${category.id}`}
              data-category-id={category.id}
            >
              <MoreVertical className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48"
            role="menu"
            aria-label={`Actions menu for category ${category.name}`}
          >
            <DropdownMenuItem
              onClick={handleEdit}
              disabled={isDeleting}
              className="cursor-pointer"
              role="menuitem"
              aria-label={`Edit category ${category.name}`}
              data-testid={`category-edit-${category.id}`}
              data-action="edit"
              data-category-id={category.id}
            >
              <Pencil className="h-4 w-4 mr-2" aria-hidden="true" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting || hasPosts}
              className="text-red-600 focus:text-red-600 cursor-pointer"
              role="menuitem"
              aria-label={`Delete category ${category.name}${hasPosts ? ' (Cannot delete - contains posts)' : ''}`}
              aria-disabled={isDeleting || hasPosts}
              data-testid={`category-delete-${category.id}`}
              data-action="delete"
              data-category-id={category.id}
              data-disable-reason={
                hasPosts ? 'has-posts' : isDeleting ? 'deleting' : undefined
              }
            >
              <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const CategoryRow = memo(CategoryRowComponent);
CategoryRow.displayName = 'CategoryRow';

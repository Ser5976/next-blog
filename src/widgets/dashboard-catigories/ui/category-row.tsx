// widgets/dashboard-categories/ui/category-row.tsx
'use client';

import { memo, useCallback } from 'react';
import { Folder, MoreVertical, Pencil, Trash2 } from 'lucide-react';

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
  console.log('category:', category);

  return (
    <div
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
      role="row"
      aria-label={`Category: ${category.name}`}
      data-testid={`category-row-${category.id}`}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Folder className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium truncate">{category.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {category._count?.posts || 0} posts
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">/{category.slug}</p>
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
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={handleEdit}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting || (category._count?.posts || 0) > 0}
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

export const CategoryRow = memo(CategoryRowComponent);
CategoryRow.displayName = 'CategoryRow';

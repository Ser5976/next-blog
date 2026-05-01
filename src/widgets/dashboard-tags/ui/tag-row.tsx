// features/dashboard-tags/ui/tag-row.tsx
'use client';

import { memo, useCallback } from 'react';
import { MoreVertical, Pencil, Tags, Trash2 } from 'lucide-react';

import { Tag } from '@/entities/dashboard-get-tags';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

interface TagRowProps {
  tag: Tag;
  onEdit: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  isDeleting?: boolean;
}

const TagRowComponent = ({
  tag,
  onEdit,
  onDelete,
  isDeleting = false,
}: TagRowProps) => {
  const handleDelete = useCallback(() => {
    if (isDeleting) return;
    onDelete(tag.id, tag.name);
  }, [tag.id, tag.name, isDeleting, onDelete]);

  const handleEdit = useCallback(() => {
    if (isDeleting) return;
    onEdit(tag.id);
  }, [tag.id, isDeleting, onEdit]);

  const hasPosts = (tag._count?.posts || 0) > 0;

  return (
    <div
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
      role="row"
      aria-label={`Tag: ${tag.name}`}
      aria-busy={isDeleting}
      aria-disabled={isDeleting}
      data-testid={`tag-row-${tag.id}`}
      data-tag-id={tag.id}
      data-tag-name={tag.name}
      data-tag-slug={tag.slug}
      data-tag-posts-count={tag._count?.posts || 0}
      data-deleting={isDeleting}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Tags
          className="h-5 w-5 text-muted-foreground flex-shrink-0"
          aria-hidden="true"
          data-testid="tag-icon"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium truncate" data-testid="tag-name">
              {tag.name}
            </h3>
            <Badge
              variant="secondary"
              className="text-xs"
              data-testid="tag-posts-badge"
              aria-label={`${tag._count?.posts || 0} posts with this tag`}
            >
              {tag._count?.posts || 0} posts
            </Badge>
          </div>
          <p
            className="text-sm text-muted-foreground mt-1"
            data-testid="tag-slug"
          >
            /{tag.slug}
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
              aria-label={`Actions for ${tag.name}`}
              aria-expanded={undefined}
              data-testid={`tag-actions-trigger-${tag.id}`}
              data-tag-id={tag.id}
            >
              <MoreVertical className="h-4 w-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48"
            role="menu"
            aria-label={`Actions menu for tag ${tag.name}`}
          >
            <DropdownMenuItem
              onClick={handleEdit}
              disabled={isDeleting}
              className="cursor-pointer"
              role="menuitem"
              aria-label={`Edit tag ${tag.name}`}
              data-testid={`tag-edit-${tag.id}`}
              data-action="edit"
              data-tag-id={tag.id}
            >
              <Pencil className="h-4 w-4 mr-2" aria-hidden="true" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting || hasPosts}
              className="text-red-600 focus:text-red-600 cursor-pointer"
              role="menuitem"
              aria-label={`Delete tag ${tag.name}${hasPosts ? ' (Cannot delete - contains posts)' : ''}`}
              aria-disabled={isDeleting || hasPosts}
              data-testid={`tag-delete-${tag.id}`}
              data-action="delete"
              data-tag-id={tag.id}
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

export const TagRow = memo(TagRowComponent);
TagRow.displayName = 'TagRow';

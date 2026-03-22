'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Loader2, MoreVertical } from 'lucide-react';

import { ArticleRowDashboard } from '@/shared/components/article-row-dashboard';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { PostRowProps } from '../model';

const PostRowComponent = ({
  post,
  onDelete,
  isDeleting = false,
}: PostRowProps) => {
  const handleDelete = () => {
    if (isDeleting) return;
    onDelete(post.id);
  };

  const isDisabled = isDeleting;

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
      role="row"
      aria-label={`Post: ${post.title}`}
      data-testid={`post-row-${post.id}`}
    >
      {/* Левая часть: картинка и детали - занимает всю ширину на мобильных */}
      <div className="flex-1 min-w-0">
        <ArticleRowDashboard article={post} />
      </div>

      {/* Правая часть: меню действий - вверху справа на мобильных, справа на десктопе */}
      <div className="flex items-center justify-end sm:justify-start flex-shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isDisabled}
              className="h-9 w-9 cursor-pointer"
              aria-label="Open post actions menu"
              aria-haspopup="true"
              aria-controls={`post-actions-menu-${post.id}`}
              data-testid="post-actions-button"
            >
              {isDeleting ? (
                <Loader2
                  className="h-4 w-4 animate-spin text-muted-foreground"
                  aria-label="Deleting post..."
                />
              ) : (
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            id={`post-actions-menu-${post.id}`}
            align="end"
            className="w-48"
            aria-label="Post actions menu"
            data-testid="post-actions-menu"
          >
            <DropdownMenuItem
              asChild
              className="cursor-pointer"
              data-testid="view-post-link"
            >
              <Link
                href={`/posts/${post.id}`}
                className="cursor-pointer flex items-center gap-2 w-full"
                aria-label={`View post: ${post.title}`}
              >
                View Post
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="cursor-pointer"
              data-testid="edit-post-link"
            >
              <Link
                href={`/dashboard/users`}
                className="cursor-pointer flex items-center gap-2 w-full"
                aria-label={`Edit post: ${post.title}`}
              >
                Edit Post
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDisabled}
              className="text-red-600 focus:text-red-600 cursor-pointer"
              aria-label={`Delete post: ${post.title}`}
              data-testid="delete-post-button"
            >
              <span className="flex items-center gap-2">
                {isDeleting ? (
                  <>
                    <Loader2
                      className="h-3 w-3 animate-spin"
                      aria-hidden="true"
                    />
                    Deleting...
                  </>
                ) : (
                  'Delete Post'
                )}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const PostRow = memo(PostRowComponent);
PostRow.displayName = 'PostRow';

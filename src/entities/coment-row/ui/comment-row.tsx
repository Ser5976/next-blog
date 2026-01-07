'use client';

import { memo } from 'react';
import Link from 'next/link';
import {
  Calendar,
  FileText,
  Loader2,
  MoreVertical,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

import { formatDate } from '@/shared/lib';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { CommentRowProps } from '../model';

const CommentRowComponent = ({
  comment,
  onDelete,
  isDeleting = false,
}: CommentRowProps) => {
  const handleDelete = () => {
    if (isDeleting) return;
    onDelete(comment.id, comment.content.substring(0, 50) + '...');
  };

  const isDisabled = isDeleting;

  // Обрезаем контент для отображения
  const displayContent =
    comment.content.length > 150
      ? comment.content.substring(0, 150) + '...'
      : comment.content;

  return (
    <div
      className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
      role="row"
      aria-label={`Comment on post: ${comment.post.title}`}
      data-testid={`comment-row-${comment.id}`}
    >
      {/* Левая часть: контент комментария */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        {/* Заголовок поста */}
        <div className="flex items-center gap-2">
          <FileText
            className="h-4 w-4 text-muted-foreground flex-shrink-0"
            aria-hidden="true"
          />
          <Link
            href={`/posts/${comment.post.slug}`}
            className="font-medium text-sm hover:underline truncate"
            target="_blank"
            aria-label={`View post: ${comment.post.title}`}
            data-testid="comment-post-link"
          >
            {comment.post.title}
          </Link>
          <Badge
            variant={comment.post.published ? 'default' : 'secondary'}
            className="flex-shrink-0"
            aria-label={`Post status: ${comment.post.published ? 'Published' : 'Draft'}`}
            data-testid="comment-post-status"
          >
            {comment.post.published ? 'Published' : 'Draft'}
          </Badge>
        </div>

        {/* Контент комментария */}
        <div className="min-w-0">
          <p
            className="text-foreground break-words"
            data-testid="comment-content"
            aria-label="Comment content"
          >
            {displayContent}
          </p>
        </div>

        {/* Метаданные */}
        <div
          className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
          role="list"
          aria-label="Comment statistics"
        >
          {/* Дата создания */}
          <div
            className="flex items-center gap-1"
            aria-label={`Commented on: ${formatDate(comment.createdAt)}`}
            data-testid="comment-date"
          >
            <Calendar
              className="h-3.5 w-3.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap">
              {formatDate(comment.createdAt)}
            </span>
          </div>

          {/* Лайки */}
          <div
            className="flex items-center gap-1"
            aria-label={`${comment.stats.likesCount} likes`}
            data-testid="comment-likes"
          >
            <ThumbsUp
              className="h-3.5 w-3.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span>{comment.stats.likesCount}</span>
          </div>
          <div
            className="flex items-center gap-1"
            aria-label={`${comment.stats.dislikesCount} dislikes`}
            data-testid="comment-dislikes"
          >
            <ThumbsDown
              className="h-3.5 w-3.5 flex-shrink-0"
              aria-hidden="true"
            />
            <span>{comment.stats.dislikesCount}</span>
          </div>
        </div>
      </div>

      {/* Правая часть: меню действий */}
      <div className="relative ml-4" aria-label="Comment actions">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isDisabled}
              className="h-9 w-9 cursor-pointer flex-shrink-0"
              aria-label="Open comment actions menu"
              aria-haspopup="true"
              aria-controls={`comment-actions-menu-${comment.id}`}
              data-testid="comment-actions-button"
            >
              {isDeleting ? (
                <Loader2
                  className="h-4 w-4 animate-spin text-muted-foreground"
                  aria-label="Deleting comment..."
                />
              ) : (
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            id={`comment-actions-menu-${comment.id}`}
            align="end"
            className="w-48"
            aria-label="Comment actions menu"
            data-testid="comment-actions-menu"
          >
            <DropdownMenuItem
              asChild
              className="cursor-pointer"
              data-testid="view-comment-link"
            >
              <Link
                href={`/posts/${comment.post.slug}#comment-${comment.id}`}
                target="_blank"
                className="cursor-pointer"
                aria-label={`View comment on post: ${comment.post.title}`}
              >
                <span className="flex items-center gap-2">View Comment</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="cursor-pointer"
              data-testid="view-post-link"
            >
              <Link
                href={`/posts/${comment.post.slug}`}
                target="_blank"
                className="cursor-pointer"
                aria-label={`View post: ${comment.post.title}`}
              >
                <span className="flex items-center gap-2">View Post</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDisabled}
              className="text-red-600 focus:text-red-600 cursor-pointer"
              aria-label={`Delete comment`}
              data-testid="delete-comment-button"
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
                  'Delete Comment'
                )}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export const CommentRow = memo(CommentRowComponent);
CommentRow.displayName = 'CommentRow';

'use client';

import { memo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  FileText,
  Loader2,
  Mail,
  MoreVertical,
  ThumbsDown,
  ThumbsUp,
  User,
} from 'lucide-react';

import { getFullName } from '@/features/user-profile-info';
import { formatDate } from '@/shared/lib';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { CommentRowProps } from '../model';

const CommentRowComponent = ({
  comment,
  onDelete,
  isEditing = false,
  isDeleting = false,
}: CommentRowProps) => {
  const handleDelete = useCallback(() => {
    if (isEditing || isDeleting) return;
    onDelete(comment.id, comment.content);
  }, [comment.id, comment.content, isEditing, isDeleting, onDelete]);

  const isDisabled = isEditing || isDeleting;
  const ariaBusy = isEditing || isDeleting;

  // Формируем aria-label
  const authorName = comment.author
    ? getFullName(comment.author)
    : 'Unknown author';
  const ariaLabel = `Comment by ${authorName} on post: ${comment.post.title}`;

  // Обрезаем контент для отображения (если очень длинный)
  const displayContent =
    comment.content.length > 200
      ? comment.content.substring(0, 200) + '...'
      : comment.content;

  // Проверяем, была ли редактирована
  const wasEdited =
    comment.updatedAt &&
    comment.createdAt &&
    comment.updatedAt !== comment.createdAt;

  return (
    <div
      className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
      role="row"
      aria-label={ariaLabel}
      aria-busy={ariaBusy}
      data-testid={`comment-row-${comment.id}`}
    >
      {/* Левая часть: информация о комментарии */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        {/* Аватар автора */}
        <div className="relative flex-shrink-0">
          {comment.author?.imageUrl ? (
            <Image
              src={comment.author.imageUrl}
              alt={authorName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border object-cover"
              aria-hidden="true"
              data-testid="comment-author-avatar"
            />
          ) : (
            <div
              className="h-12 w-12 rounded-full bg-gradient-to-br from-muted to-muted/70 border flex items-center justify-center"
              data-testid="comment-author-avatar-placeholder"
            >
              <User
                className="h-6 w-6 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Основная информация */}
        <div className="flex-1 min-w-0">
          {/* Автор и дата */}
          <div className="flex items-center gap-2 mb-2">
            <h4
              className="font-medium text-foreground"
              data-testid="comment-author-name"
            >
              {authorName}
            </h4>
            {comment.author && (
              <span
                className="flex items-center gap-1 text-sm text-muted-foreground truncate max-w-[200px]"
                title={comment.author.email}
                data-testid="comment-author-email"
              >
                <Mail className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                <span className="truncate">{comment.author.email}</span>
              </span>
            )}
          </div>

          {/* Контент комментария */}
          <div className="mb-3">
            <p
              className="text-foreground break-words"
              data-testid="comment-content"
            >
              {displayContent}
            </p>
          </div>

          {/* Метаданные: пост, даты, статистика */}
          <div
            className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
            role="list"
            aria-label="Comment metadata"
          >
            {/* Пост */}
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              <Link
                href={`/posts/${comment.post.slug}`}
                className="hover:underline truncate max-w-[200px]"
                target="_blank"
                aria-label={`View post: ${comment.post.title}`}
                data-testid="comment-post-link"
              >
                {comment.post.title}
              </Link>
              <Badge
                variant={comment.post.published ? 'default' : 'secondary'}
                className="flex-shrink-0 text-xs"
                data-testid="comment-post-status"
              >
                {comment.post.published ? 'Published' : 'Draft'}
              </Badge>
            </div>

            {/* Дата создания */}
            {comment.createdAt && (
              <span
                className="flex items-center gap-1 whitespace-nowrap"
                role="listitem"
                data-testid="comment-created-at"
              >
                <Calendar
                  className="h-3 w-3 flex-shrink-0"
                  aria-hidden="true"
                />
                {formatDate(comment.createdAt)}
                {wasEdited && (
                  <span className="text-xs italic" title="Edited">
                    (edited)
                  </span>
                )}
              </span>
            )}

            {/* Статистика */}
            <div className="flex items-center gap-2">
              <span
                className="flex items-center gap-1"
                aria-label={`${comment.stats.likesCount} likes`}
                data-testid="comment-likes"
              >
                <ThumbsUp
                  className="h-3 w-3 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>{comment.stats.likesCount}</span>
              </span>
              <span
                className="flex items-center gap-1"
                aria-label={`${comment.stats.dislikesCount} dislikes`}
                data-testid="comment-dislikes"
              >
                <ThumbsDown
                  className="h-3 w-3 flex-shrink-0"
                  aria-hidden="true"
                />
                <span>{comment.stats.dislikesCount}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть: действия */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-4">
        {/* Меню действий */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isDisabled}
              className="h-9 w-9 cursor-pointer"
              aria-label={`Actions for comment by ${authorName}`}
              aria-haspopup="true"
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
            align="end"
            className="w-48"
            data-testid="comment-actions-menu"
          >
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDisabled}
              className="text-red-600 focus:text-red-600 cursor-pointer"
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

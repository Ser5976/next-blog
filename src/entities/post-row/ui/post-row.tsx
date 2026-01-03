'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Eye,
  FileText,
  Loader2,
  MessageCircle,
  MoreVertical,
  Star,
  TagIcon,
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
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
      role="row"
      aria-label={`Post: ${post.title}`}
      data-testid={`post-row-${post.id}`}
    >
      {/* Левая часть: картинка и детали */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Картинка */}
        <div className="relative">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={`Cover image for post: ${post.title}`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border object-cover flex-shrink-0"
              aria-hidden="true"
              data-testid="post-cover-image"
            />
          ) : (
            <div
              className="h-12 w-12 rounded-full bg-gradient-to-br from-muted to-muted/70 border flex items-center justify-center flex-shrink-0"
              aria-label="No cover image"
              data-testid="post-cover-placeholder"
            >
              <FileText
                className="h-6 w-6 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Детали */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className="font-medium truncate text-foreground"
              data-testid="post-title"
              id={`post-title-${post.id}`}
            >
              {post.title}
            </h4>
          </div>

          <div
            className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
            role="list"
            aria-label="Post statistics"
          >
            {/* Статус поста */}
            <Badge
              variant={post.published ? 'default' : 'secondary'}
              className="flex items-center gap-1"
              aria-label={`Post status: ${post.published ? 'Published' : 'Draft'}`}
              data-testid="post-status"
            >
              {post.published ? (
                <>
                  <div
                    className="h-2 w-2 rounded-full bg-green-500"
                    aria-hidden="true"
                  />
                  Published
                </>
              ) : (
                <>
                  <div
                    className="h-2 w-2 rounded-full bg-amber-500"
                    aria-hidden="true"
                  />
                  Draft
                </>
              )}
            </Badge>

            {/* Просмотры */}
            <div
              className="flex items-center gap-1 text-sm text-muted-foreground"
              aria-label={`${post.viewCount.toLocaleString()} views`}
              data-testid="post-views"
            >
              <Eye className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap">
                {post.viewCount.toLocaleString()}
              </span>
            </div>

            {/* Рейтинг */}
            <div
              className="flex items-center gap-1 text-sm text-muted-foreground"
              aria-label={`Rating: ${post.averageRating?.toFixed(1)} out of ${post.ratingCount} ratings`}
              data-testid="post-rating"
            >
              <Star className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
              {post.averageRating && (
                <span className="whitespace-nowrap">
                  {post.averageRating.toFixed(1)}
                  <span className="hidden sm:inline">({post.ratingCount})</span>
                </span>
              )}
            </div>

            {/* Комментарии */}
            <div
              className="flex items-center gap-1 text-sm text-muted-foreground"
              aria-label={`${post.stats.commentsCount} comments`}
              data-testid="post-comments"
            >
              <MessageCircle
                className="h-3.5 w-3.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span>{post.stats.commentsCount}</span>
            </div>

            {/* Категория */}
            {post.category && (
              <div
                className="flex items-center gap-1 text-sm text-muted-foreground"
                aria-label={`Category: ${post.category.name}`}
                data-testid="post-category"
              >
                <TagIcon
                  className="h-3.5 w-3.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="truncate max-w-[120px] sm:max-w-[180px]">
                  {post.category.name}
                </span>
              </div>
            )}
          </div>

          {/* Превью содержимого */}
          {post.excerpt && (
            <p
              className="mt-3 text-sm text-muted-foreground line-clamp-2"
              aria-label="Post excerpt"
              data-testid="post-excerpt"
            >
              {post.excerpt}
            </p>
          )}

          {/* Дата создания */}
          <div
            className="flex items-center gap-1 whitespace-nowrap mt-2"
            aria-label={`Published on: ${formatDate(post.publishedAt ?? post.createdAt)}`}
            data-testid="post-date"
          >
            {formatDate(post.publishedAt ?? post.createdAt)}
          </div>
        </div>
      </div>

      {/* Правая часть: меню действий */}
      <div className="relative" aria-label="Post actions">
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
                className="cursor-pointer"
                aria-label={`View post: ${post.title}`}
              >
                <span className="flex items-center gap-2">View Post</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              asChild
              className="cursor-pointer"
              data-testid="edit-post-link"
            >
              <Link
                href={`/dashboard/users`}
                className="cursor-pointer"
                aria-label={`Edit post: ${post.title}`}
              >
                <span className="flex items-center gap-2">Edit Post</span>
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

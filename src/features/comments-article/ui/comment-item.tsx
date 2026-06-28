'use client';

import { memo, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import {
  Check,
  Edit2,
  MoreVertical,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  X,
} from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Textarea } from '@/shared/ui/textarea';
import { Comment } from '../model';

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onDislike: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  isLiking?: boolean;
  isDeleting?: boolean;
  isEditing?: boolean;
}

const CommentItemComponent = ({
  comment,
  onLike,
  onDislike,
  onEdit,
  onDelete,
  isLiking = false,
  isDeleting = false,
}: CommentItemProps) => {
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditingMode && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditingMode]);

  const handleLike = () => {
    onLike(comment.id);
  };

  const handleDislike = () => {
    onDislike(comment.id);
  };

  const handleEditSubmit = async () => {
    if (editContent.trim().length < 2) {
      return;
    }
    if (editContent === comment.content) {
      setIsEditingMode(false);
      return;
    }
    setIsSubmittingEdit(true);
    try {
      await onEdit(comment.id, editContent.trim());
      setIsEditingMode(false);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleEditCancel = () => {
    setEditContent(comment.content);
    setIsEditingMode(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      await onDelete(comment.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleEditSubmit();
    }
    if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 dark:border-gray-800">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {comment.author?.imageUrl ? (
          <Image
            src={comment.author.imageUrl}
            alt={comment.author.name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-medium">
            {comment.author?.name?.toUpperCase() || 'U'}
          </div>
        )}
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm text-gray-900 dark:text-white">
            {comment.author?.name}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
          {comment.updatedAt !== comment.createdAt && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              (edited)
            </span>
          )}
        </div>

        {/* Content or Edit Form */}
        {isEditingMode ? (
          <div className="mt-2 space-y-2">
            <Textarea
              ref={textareaRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[80px] resize-none text-sm"
              placeholder="Edit your comment..."
              disabled={isSubmittingEdit}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleEditSubmit}
                disabled={isSubmittingEdit || editContent.trim().length < 2}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleEditCancel}
                disabled={isSubmittingEdit}
              >
                <X className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-1 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}

        {/* Actions */}
        {!isEditingMode && (
          <div className="flex items-center gap-1 mt-2">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={cn(
                'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors',
                comment.userReaction === 'like'
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              )}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{comment.likesCount > 0 ? comment.likesCount : ''}</span>
            </button>

            <button
              onClick={handleDislike}
              disabled={isLiking}
              className={cn(
                'flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors',
                comment.userReaction === 'dislike'
                  ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              )}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>
                {comment.dislikesCount > 0 ? comment.dislikesCount : ''}
              </span>
            </button>

            {/* Action Menu - Only for author */}
            {comment.isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Comment actions"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-36">
                  <DropdownMenuItem
                    onClick={() => setIsEditingMode(true)}
                    className="cursor-pointer"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const CommentItem = memo(CommentItemComponent);
CommentItem.displayName = 'CommentItem';

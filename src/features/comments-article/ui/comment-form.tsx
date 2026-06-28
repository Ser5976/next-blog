'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { User } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
  placeholder?: string;
}

export function CommentForm({
  onSubmit,
  isSubmitting = false,
  placeholder = 'Write a comment...',
}: CommentFormProps) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [content]);

  const handleSubmit = async () => {
    if (!isSignedIn || !content.trim() || content.trim().length < 2) return;
    await onSubmit(content.trim());
    setContent('');
    adjustHeight();
    setIsFocused(false);
  };

  const handleCancel = () => {
    setContent('');
    setIsFocused(false);
    if (textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getUserInitial = () => {
    if (user?.firstName) return user.firstName[0];
    if (user?.lastName) return user.lastName[0];
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress[0].toUpperCase();
    }
    return 'U';
  };

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <User className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please sign in to leave a comment
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="Your avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-medium">
            {getUserInitial()}
          </div>
        )}
      </div>

      {/* Form */}
      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isSubmitting}
          className={cn(
            'min-h-[40px] resize-none text-sm transition-all',
            isFocused ? 'border-emerald-500 ring-1 ring-emerald-500' : ''
          )}
          rows={1}
        />

        {isFocused && (
          <div className="flex justify-end gap-2 mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={
                isSubmitting || !content.trim() || content.trim().length < 2
              }
              className="rounded-full bg-emerald-600 hover:bg-emerald-700"
            >
              {isSubmitting ? 'Posting...' : 'Comment'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

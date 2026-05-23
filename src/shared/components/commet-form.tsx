'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Textarea } from '@/shared/ui/textarea';
import {
  commentFormSchema,
  CommentFormValues,
} from '../schemas/comment-form-schemas';
import { Comment } from '../types';

interface CommentFormProps {
  initialData?: Comment | null;
  onSubmit: (data: CommentFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function CommentForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: CommentFormProps) {
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        content: initialData.content,
      });
    } else {
      form.reset({
        content: '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: CommentFormValues) => {
    await onSubmit(data);
  };

  const isEditMode = !!initialData;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
        aria-label={isEditMode ? 'Edit category form' : 'Create category form'}
        data-testid="category-form"
      >
        <Card>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel id="comment-name-label">Comment</FormLabel>
                  <FormControl>
                    <Textarea
                      id="comment"
                      placeholder="e.g., Technology"
                      aria-labelledby="comment-label"
                      aria-describedby="comment-description comment-error"
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.content}
                      data-testid="comment-name-input"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription id="comment-description">
                    The display of the comment
                  </FormDescription>
                  <FormMessage id="comment-error" data-testid="comment-error" />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isSubmitting}
            className="cursor-pointer"
            aria-label="Reset form to initial values"
            data-testid="comment-form-reset-button"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer min-w-[160px]" // Фиксированная минимальная ширина
            aria-label={isEditMode ? 'Update comment' : 'Create comment'}
            aria-disabled={isSubmitting}
            data-testid="comment-form-submit-button"
          >
            <span className="relative inline-flex items-center justify-center gap-2">
              {/* Всегда резервируем место под иконку */}
              <span
                className="w-4 h-4 flex items-center justify-center"
                aria-hidden="true"
              >
                {isSubmitting ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    data-testid="submit-spinner"
                  />
                ) : (
                  <span className="w-4 h-4" /> // Прозрачный плейсхолдер
                )}
              </span>
              {isEditMode ? 'Update Comment' : 'Create Comment'}
            </span>
          </Button>
        </div>

        {/* Сообщение о статусе для screen readers */}
        {isSubmitting && (
          <div
            className="sr-only"
            role="status"
            aria-live="polite"
            data-testid="submitting-status"
          >
            {isEditMode
              ? 'Updating comment, please wait...'
              : 'Creating comment, please wait...'}
          </div>
        )}

        {/* Сообщение об ошибке формы, если есть общая ошибка */}
        {form.formState.isSubmitted &&
          Object.keys(form.formState.errors).length > 0 && (
            <div
              className="sr-only"
              role="alert"
              aria-live="assertive"
              data-testid="form-errors-status"
            >
              Please fix the errors in the form before submitting.
            </div>
          )}
      </form>
    </Form>
  );
}

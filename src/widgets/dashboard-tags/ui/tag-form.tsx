'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Tag } from '@/entities/dashboard-get-tags';
import { tagFormSchema, TagFormValues } from '@/shared/schemas';
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
import { Input } from '@/shared/ui/input';

interface TagFormProps {
  initialData?: Tag | null;
  onSubmit: (data: TagFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function TagForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: TagFormProps) {
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagFormSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        slug: initialData.slug,
      });
    } else {
      form.reset({
        name: '',
        slug: '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: TagFormValues) => {
    await onSubmit(data);
  };

  const isEditMode = !!initialData;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
        aria-label={isEditMode ? 'Edit tag form' : 'Create tag form'}
        data-testid="tag-form"
      >
        <Card>
          <CardContent className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel id="tag-name-label">Tag Name</FormLabel>
                  <FormControl>
                    <Input
                      id="tag-name"
                      placeholder="e.g., JavaScript"
                      aria-labelledby="tag-name-label"
                      aria-describedby="tag-name-description tag-name-error"
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.name}
                      data-testid="tag-name-input"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription id="tag-name-description">
                    The display name of the tag
                  </FormDescription>
                  <FormMessage
                    id="tag-name-error"
                    data-testid="tag-name-error"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel id="tag-slug-label">Slug</FormLabel>
                  <FormControl>
                    <Input
                      id="tag-slug"
                      placeholder="e.g., javascript"
                      aria-labelledby="tag-slug-label"
                      aria-describedby="tag-slug-description tag-slug-error"
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.slug}
                      data-testid="tag-slug-input"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription id="tag-slug-description">
                    URL-friendly version of the tag name (e.g.,
                    /blog/tag/javascript)
                  </FormDescription>
                  <FormMessage
                    id="tag-slug-error"
                    data-testid="tag-slug-error"
                  />
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
            data-testid="tag-form-reset-button"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer min-w-[160px]"
            aria-label={isEditMode ? 'Update tag' : 'Create tag'}
            aria-disabled={isSubmitting}
            data-testid="tag-form-submit-button"
          >
            <span className="relative inline-flex items-center justify-center gap-2">
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
                  <span className="w-4 h-4" />
                )}
              </span>
              {isEditMode ? 'Update Tag' : 'Create Tag'}
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
              ? 'Updating tag, please wait...'
              : 'Creating tag, please wait...'}
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

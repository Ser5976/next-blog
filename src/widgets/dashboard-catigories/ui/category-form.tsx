'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import { Category } from '@/entities/dashboard-get-categories';
import { categoryFormSchema, CategoryFormValues } from '@/shared/schemas';
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

interface CategoryFormProps {
  initialData?: Category | null;
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  isSubmitting?: boolean;
}

export function CategoryForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
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

  const handleSubmit = async (data: CategoryFormValues) => {
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel id="category-name-label">Category Name</FormLabel>
                  <FormControl>
                    <Input
                      id="category-name"
                      placeholder="e.g., Technology"
                      aria-labelledby="category-name-label"
                      aria-describedby="category-name-description category-name-error"
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.name}
                      data-testid="category-name-input"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription id="category-name-description">
                    The display name of the category
                  </FormDescription>
                  <FormMessage
                    id="category-name-error"
                    data-testid="category-name-error"
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel id="category-slug-label">Slug</FormLabel>
                  <FormControl>
                    <Input
                      id="category-slug"
                      placeholder="e.g., technology"
                      aria-labelledby="category-slug-label"
                      aria-describedby="category-slug-description category-slug-error"
                      aria-required="true"
                      aria-invalid={!!form.formState.errors.slug}
                      data-testid="category-slug-input"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription id="category-slug-description">
                    URL-friendly version of the category name (e.g.,
                    /blog/technology)
                  </FormDescription>
                  <FormMessage
                    id="category-slug-error"
                    data-testid="category-slug-error"
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
            data-testid="category-form-reset-button"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer min-w-[160px]" // Фиксированная минимальная ширина
            aria-label={isEditMode ? 'Update category' : 'Create category'}
            aria-disabled={isSubmitting}
            data-testid="category-form-submit-button"
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
              {isEditMode ? 'Update Category' : 'Create Category'}
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
              ? 'Updating category, please wait...'
              : 'Creating category, please wait...'}
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

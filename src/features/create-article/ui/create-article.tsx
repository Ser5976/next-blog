'use client';

import { useState } from 'react';

import { useCategories } from '@/entities/dashboard-get-categories';
import { useTags } from '@/entities/dashboard-get-tags';
import { ArticleForm } from '@/shared/components/article-form';
import { ArticleFormValues } from '@/shared/schemas';
import { UniversalError } from '@/shared/ui';
import { LoadingScreen } from '@/shared/ui/loading-screen';
import { useCreateArticle } from '../hooks';

export const CreateArticle = () => {
  const [slugError, setSlugError] = useState<string | null>(null);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const {
    data: tags,
    isLoading: isLoadingTags,
    error: tagsError,
    refetch: refetchTags,
  } = useTags();

  const createArticleMutation = useCreateArticle();

  const handleSubmitArticle = async (data: ArticleFormValues) => {
    setSlugError(null);
    try {
      await createArticleMutation.mutateAsync(data);
    } catch (error: any) {
      // Обработка ошибки slug
      if (error?.response?.data?.error === 'SLUG_ALREADY_EXISTS') {
        setSlugError(error.response.data.message);
      }
      console.error('Error saving article:', error);
    }
  };

  const handleRetry = () => {
    refetchCategories();
    refetchTags();
  };

  // Проверка на загрузку
  if (isLoadingCategories || isLoadingTags) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Loading form data"
        data-testid="loading-state"
      >
        <LoadingScreen
          title="Loading..."
          text="Please wait while we prepare the article form"
        />
      </div>
    );
  }

  // Проверка на ошибки
  if (categoriesError || tagsError) {
    const error = categoriesError || tagsError;
    const errorMessage =
      categoriesError?.message ||
      tagsError?.message ||
      'Failed to load categories or tags';

    return (
      <div
        className="min-h-screen bg-background p-4 md:p-6"
        role="alert"
        aria-live="assertive"
        aria-label="Error loading form data"
        data-testid="error-state"
      >
        <UniversalError
          error={error}
          message={errorMessage}
          title="Failed to Load Form Data"
          onRetry={handleRetry}
          variant="card"
          data-testid="load-error"
        >
          <p
            className="text-xs text-muted-foreground mt-4"
            data-testid="error-hint"
          >
            Please check your connection and try again
          </p>
        </UniversalError>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-6"
      data-testid="create-article"
      role="main"
      aria-label="Create article page"
    >
      <header aria-label="Page header">
        <h1
          className="text-3xl font-bold mb-8"
          data-testid="create-article-title"
          id="create-article-heading"
        >
          Create New Article
        </h1>
      </header>

      <div
        className="w-full overflow-y-auto p-2"
        role="region"
        aria-label="Article creation form container"
        data-testid="create-article-container"
      >
        <h2
          className="text-muted-foreground text-sm"
          data-testid="create-article-subtitle"
          id="create-article-subheading"
        >
          Create a new article for your blog
        </h2>

        {/* Ошибка slug */}
        {slugError && (
          <div
            className="mt-4 mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg"
            role="alert"
            aria-live="assertive"
            data-testid="slug-error"
          >
            <p className="text-destructive text-sm">
              <strong>Error:</strong> {slugError}
            </p>
          </div>
        )}

        <div
          className="mt-6"
          role="form"
          aria-labelledby="create-article-subheading"
          data-testid="article-form-wrapper"
        >
          <ArticleForm
            onSubmit={handleSubmitArticle}
            isSubmitting={createArticleMutation.isPending}
            categories={categories || []}
            availableTags={tags || []}
          />
        </div>
      </div>
    </div>
  );
};

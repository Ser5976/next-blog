'use client';

import { useState } from 'react';

import { useCategories } from '@/entities/dashboard-get-categories';
import { useTags } from '@/entities/dashboard-get-tags';
import { useArticle } from '@/entities/get-article';
import { ArticleForm } from '@/shared/components/article-form';
import { ArticleFormValues } from '@/shared/schemas';
import { UniversalError } from '@/shared/ui';
import { LoadingScreen } from '@/shared/ui/loading-screen';
import { useUpdateArticle } from '../hooks';

export const EditArticle = ({ articleId }: { articleId: string }) => {
  const [slugError, setSlugError] = useState<string | null>(null);

  const {
    data: article,
    isLoading: isLoadingArticle,
    error: articleError,
    refetch: refetchArticle,
  } = useArticle(articleId);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  const { data: tags, isLoading: isLoadingTags, error: tagsError } = useTags();

  const updateArticleMutation = useUpdateArticle();

  const handleSubmitArticle = async (updateData: ArticleFormValues) => {
    try {
      await updateArticleMutation.mutateAsync({
        id: articleId,
        data: updateData,
      });
    } catch (error: any) {
      console.error('Error saving article:', error);
      // Обработка ошибки slug
      if (error?.response?.data?.error === 'SLUG_ALREADY_EXISTS') {
        setSlugError(error.response.data.message);
      }
    } finally {
    }
  };

  // Проверка на загрузку
  if (isLoadingArticle || isLoadingCategories || isLoadingTags) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label="Loading article data"
        data-testid="loading-state"
      >
        <LoadingScreen
          title="Loading article..."
          text="Please wait while we fetch the article data"
        />
      </div>
    );
  }

  // Проверка на ошибки
  if (articleError || categoriesError || tagsError) {
    const error = articleError || categoriesError || tagsError;
    const errorMessage =
      articleError?.message ||
      categoriesError?.message ||
      tagsError?.message ||
      'Failed to load article data';

    return (
      <div
        className="min-h-screen bg-background p-4 md:p-6"
        role="alert"
        aria-live="assertive"
        aria-label="Error loading article"
        data-testid="error-state"
      >
        <UniversalError
          error={error}
          message={errorMessage}
          title="Failed to Load Article"
          onRetry={() => {
            refetchArticle();
          }}
          variant="card"
          data-testid="load-error"
        >
          <p
            className="text-xs text-muted-foreground mt-4"
            data-testid="error-article-id"
          >
            Article ID: {articleId}
          </p>
        </UniversalError>
      </div>
    );
  }

  // Проверка, что статья существует
  if (!article) {
    return (
      <div
        className="min-h-screen bg-background p-4 md:p-6"
        role="alert"
        aria-live="assertive"
        aria-label="Article not found"
        data-testid="not-found-state"
      >
        <UniversalError
          title="Article Not Found"
          message={`No article found with ID: ${articleId}`}
          variant="card"
          onRetry={() => refetchArticle()}
          data-testid="not-found-error"
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-6"
      data-testid="edit-article"
      role="main"
      aria-label="Edit article page"
    >
      <header aria-label="Page header">
        <h1
          className="text-3xl font-bold mb-8"
          data-testid="edit-article-title"
          id="edit-article-heading"
        >
          Edit Article
        </h1>
      </header>
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
        className="w-full overflow-y-auto p-2"
        role="region"
        aria-label="Article edit form container"
        data-testid="edit-article-container"
      >
        <h2
          className="text-muted-foreground text-sm"
          data-testid="edit-article-subtitle"
          id="edit-article-subheading"
        >
          Make changes to your article
        </h2>

        <div
          className="mt-6"
          role="form"
          aria-labelledby="edit-article-subheading"
          data-testid="article-form-wrapper"
        >
          <ArticleForm
            initialData={{
              title: article.title,
              slug: article.slug,
              content: article.content,
              excerpt: article.excerpt || '',
              coverImage: article.coverImage,
              categoryId: article.categoryId,
              tags: article.tags.map((tag) => tag.id),
            }}
            onSubmit={handleSubmitArticle}
            isSubmitting={updateArticleMutation.isPending}
            categories={categories || []}
            availableTags={tags || []}
          />
        </div>
      </div>
    </div>
  );
};

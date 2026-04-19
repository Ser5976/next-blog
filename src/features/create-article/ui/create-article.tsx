'use client';

import { useState } from 'react';

import { useCategories } from '@/entities/dashboard-get-categories';
import { useTags } from '@/entities/dashboard-get-tags';
import { ArticleForm } from '@/shared/components/article-form';
import { ArticleFormValues } from '@/shared/schemas';
import { useCreateArticle } from '../hooks';

export const CreateArticle = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const createArticlesMutation = useCreateArticle();

  const handleSubmitArticle = async (data: ArticleFormValues) => {
    setIsSubmitting(true);
    try {
      await createArticlesMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-6"
      data-testid="craete-articles"
    >
      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>

      {/* Article Form Sheet */}
      <div className="w-full  overflow-y-auto p-2">
        <h2 className="text-muted-foreground text-sm">
          Create a new article for your blog
        </h2>

        <div className="mt-6">
          <ArticleForm
            onSubmit={handleSubmitArticle}
            isSubmitting={isSubmitting}
            categories={categories}
            availableTags={tags}
          />
        </div>
      </div>
    </div>
  );
};

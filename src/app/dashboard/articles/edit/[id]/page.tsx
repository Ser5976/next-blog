'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  getArticles,
  updateArticleAction,
} from '@/widgets/dashboard-articles/api';
import { ArticleFormValues } from '@/widgets/dashboard-articles/model';
import { ArticleForm } from '@/widgets/dashboard-articles/ui';

export default function EditArticlePage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<ArticleFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const response = await getArticles({
          page: 1,
          limit: 100,
        });
        const found = response.articles.find((a) => a.id === id);

        if (found) {
          // Преобразуем данные для формы
          setArticle({
            title: found.title,
            slug: found.slug,
            content: found.content,
            excerpt: found.excerpt || '',
            coverImage: found.coverImage,
            published: found.published,
            categoryId: found.category?.id || null,
            tags: found.tags.map((tag) => tag.id),
            publishedAt: found.publishedAt ? new Date(found.publishedAt) : null,
          });
        } else {
          toast.error('Article not found');
          router.push('/dashboard/articles');
        }
      } catch (error) {
        console.log('loadArticle:', error);
        toast.error('Failed to load article');
        router.push('/dashboard/articles');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [id, router]);

  const handleSubmit = async (data: ArticleFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateArticleAction(id as string, data);
      if (result.success) {
        toast.success('Article updated successfully');
        router.push('/dashboard/articles');
      } else {
        toast.error(result.message || 'Failed to update article');
      }
    } catch (error) {
      console.log('handleSubmit:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold">Article not found</h1>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Edit Article</h1>
      <ArticleForm
        initialData={article}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

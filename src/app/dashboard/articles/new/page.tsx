'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { createArticleAction } from '@/widgets/dashboard-articles/api';
import { ArticleForm } from '@/widgets/dashboard-articles/ui';

export default function NewArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await createArticleAction(data);
      if (result.success) {
        toast.success('Article created successfully');
        router.push('/dashboard/articles');
      } else {
        toast.error(result.message || 'Failed to create article');
      }
    } catch (error) {
      console.log('NewArticlePage:', error);
      toast.error('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>
      <ArticleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
}

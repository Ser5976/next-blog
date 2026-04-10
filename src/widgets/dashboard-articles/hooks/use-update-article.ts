import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { updateArticle } from '../api';
import { ArticleFormValues } from '../model';
import { articlesQueryKeys } from './use-articles';

export function useUpdateArticle() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ArticleFormValues }) =>
      updateArticle(id, data),

    onSuccess: () => {
      toast.success('Article updated successfully');
      queryClient.invalidateQueries({
        queryKey: articlesQueryKeys.all,
      });
      router.push('/dashboard/articles');
    },

    onError: (error) => {
      toast.error(error.message || 'Failed to update article');
    },
  });
}

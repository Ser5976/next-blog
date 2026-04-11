import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ArticlesResponse } from '@/entities/get-articles/model';
import { articlesQueryKeys } from '@/shared/api';
import { togglePublishArticle } from '../api';

export function useTogglePublish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      togglePublishArticle(id, published),

    onMutate: async ({ id, published }) => {
      await queryClient.cancelQueries({
        queryKey: articlesQueryKeys.all,
      });

      const previousArticlesData = queryClient.getQueriesData<ArticlesResponse>(
        {
          queryKey: articlesQueryKeys.lists(),
        }
      );

      queryClient.setQueriesData<ArticlesResponse>(
        { queryKey: articlesQueryKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            articles: old.articles.map((article) =>
              article.id === id ? { ...article, published } : article
            ),
          };
        }
      );

      return { previousArticlesData };
    },

    onError: (error, variables, context) => {
      toast.error(error.message || 'Failed to update article status');

      if (context?.previousArticlesData) {
        context.previousArticlesData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSuccess: (_, { published }) => {
      toast.success(published ? 'Article published' : 'Article unpublished');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: articlesQueryKeys.all });
    },
  });
}

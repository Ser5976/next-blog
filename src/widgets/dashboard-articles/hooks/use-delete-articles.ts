import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteArticle } from '../api';
import { ArticlesResponse } from '../model';
import { articlesQueryKeys } from './use-articles';

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,

    onMutate: async (articleId) => {
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
            articles: old.articles.filter(
              (article) => article.id !== articleId
            ),
            total: old.total - 1,
          };
        }
      );

      return { previousArticlesData };
    },

    onError: (error, articleId, context) => {
      toast.error(error.message || 'Failed to delete article');

      if (context?.previousArticlesData) {
        context.previousArticlesData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSuccess: () => {
      toast.success('Article deleted successfully');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: articlesQueryKeys.all });
    },
  });
}

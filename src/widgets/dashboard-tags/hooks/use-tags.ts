import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Tag } from '@/entities/dashboard-get-tags';
import { tagsQueryKeys } from '@/entities/dashboard-get-tags/hooks/use-tags';
import { TagFormValues } from '@/shared/schemas';
import { createTag, deleteTag, getTag, updateTag } from '../api';

export function useTag(id: string | null) {
  return useQuery<Tag | null, Error>({
    queryKey: tagsQueryKeys.detail(id || ''),
    queryFn: () => (id ? getTag(id) : null),
    enabled: !!id,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      toast.success('Tag created successfully');
      queryClient.invalidateQueries({ queryKey: tagsQueryKeys.all });
    },
    onError: (error: any) => {
      // Проверяем на ошибку уникальности slug
      if (error?.response?.data?.error === 'SLUG_ALREADY_EXISTS') {
        toast.error(
          error.response.data.message ||
            'This slug is already taken. Please choose a different one.'
        );
      } else {
        toast.error(error?.message || 'Failed to create article');
      }
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TagFormValues }) =>
      updateTag(id, data),
    onSuccess: () => {
      toast.success('Tag updated successfully');
      queryClient.invalidateQueries({ queryKey: tagsQueryKeys.all });
    },
    onError: (error: any) => {
      // Проверяем на ошибку уникальности slug
      if (error?.response?.data?.error === 'SLUG_ALREADY_EXISTS') {
        toast.error(
          error.response.data.message ||
            'This slug is already taken. Please choose a different one.'
        );
      } else {
        toast.error(error?.message || 'Failed to create article');
      }
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTag,
    onMutate: async (tagId) => {
      await queryClient.cancelQueries({ queryKey: tagsQueryKeys.all });

      const previousTags = queryClient.getQueryData<Tag[]>(
        tagsQueryKeys.list()
      );

      queryClient.setQueryData<Tag[]>(tagsQueryKeys.list(), (old) => {
        if (!old) return old;
        return old.filter((tag) => tag.id !== tagId);
      });

      return { previousTags };
    },
    onError: (error: Error, _, context) => {
      toast.error(error.message || 'Failed to delete tag');
      if (context?.previousTags) {
        queryClient.setQueryData(tagsQueryKeys.list(), context.previousTags);
      }
    },
    onSuccess: () => {
      toast.success('Tag deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tagsQueryKeys.all });
    },
  });
}

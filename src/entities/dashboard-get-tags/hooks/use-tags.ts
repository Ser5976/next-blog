import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createTag, deleteTag, getTag, getTags, updateTag } from '../api';
import { Tag, TagFormValues } from '../model';

export const tagsQueryKeys = {
  all: ['dashboard-tags'] as const,
  lists: () => [...tagsQueryKeys.all, 'list'] as const,
  list: () => [...tagsQueryKeys.lists()] as const,
  details: () => [...tagsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagsQueryKeys.details(), id] as const,
};

export function useTags(enabled: boolean = true) {
  return useQuery<Tag[], Error>({
    queryKey: tagsQueryKeys.list(),
    queryFn: () => getTags(),
    enabled: enabled,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
}

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
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create tag');
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
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update tag');
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

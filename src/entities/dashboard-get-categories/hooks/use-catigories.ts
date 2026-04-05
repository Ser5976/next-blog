import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../api';
import { Category, CategoryFormValues } from '../model';

export const categoriesQueryKeys = {
  all: ['dashboard-categories'] as const,
  lists: () => [...categoriesQueryKeys.all, 'list'] as const,
  list: () => [...categoriesQueryKeys.lists()] as const,
  details: () => [...categoriesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoriesQueryKeys.details(), id] as const,
};

export function useCategories(enabled: boolean = true) {
  return useQuery<Category[], Error>({
    queryKey: categoriesQueryKeys.list(),
    queryFn: () => getCategories(),
    enabled: enabled,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    placeholderData: undefined,
  });
}

export function useCategory(id: string | null) {
  return useQuery<Category | null, Error>({
    queryKey: categoriesQueryKeys.detail(id || ''),
    queryFn: () => (id ? getCategory(id) : null),
    enabled: !!id,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create category');
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormValues }) =>
      updateCategory(id, data),
    onSuccess: () => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update category');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: categoriesQueryKeys.all });

      const previousCategories = queryClient.getQueryData<Category[]>(
        categoriesQueryKeys.list()
      );

      queryClient.setQueryData<Category[]>(
        categoriesQueryKeys.list(),
        (old) => {
          if (!old) return old;
          return old.filter((category) => category.id !== categoryId);
        }
      );

      return { previousCategories };
    },
    onError: (error: Error, _, context) => {
      toast.error(error.message || 'Failed to delete category');
      if (context?.previousCategories) {
        queryClient.setQueryData(
          categoriesQueryKeys.list(),
          context.previousCategories
        );
      }
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
}

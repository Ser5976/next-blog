'use client';

import { useState } from 'react';
import { ChartColumnStacked, Loader2, Plus, RefreshCw } from 'lucide-react';

import { useCategories } from '@/entities/dashboard-get-categories';
import { SheetForm } from '@/shared/components';
import { CategoryFormValues } from '@/shared/schemas';
import { ConfirmDialog, UniversalEmpty, UniversalError } from '@/shared/ui';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import {
  useCategory,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../hooks';
import { CategoryForm } from './category-form';
import { CategoryRow } from './category-row';

const DASHBOARD_CATEGORIES_CONFIG = {
  title: 'Categories Management',
  subtitle: 'Create, edit, and manage your blog categories',
} as const;

export const DashboardCategories = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    categoryId: string | null;
  }>({ open: false, categoryId: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    categoryId: string | null;
    categoryName: string | null;
  }>({ open: false, categoryId: null, categoryName: null });
  const [slugError, setSlugError] = useState<string | null>(null);

  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCategories();

  const {
    data: category,
    isLoading: isLoadingCategory,
    error: categoryError,
    refetch: refetchCategory,
  } = useCategory(editDialog.categoryId);
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const handleCreateCategory = () => {
    setEditDialog({ open: true, categoryId: null });
  };

  const handleEditCategory = (id: string) => {
    setEditDialog({ open: true, categoryId: id });
  };

  const handleDeleteClick = (categoryId: string, categoryName: string) => {
    setDeleteDialog({
      open: true,
      categoryId,
      categoryName,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.categoryId) {
      deleteCategoryMutation.mutate(deleteDialog.categoryId, {
        onSettled: () => {
          setDeleteDialog({
            open: false,
            categoryId: null,
            categoryName: null,
          });
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, categoryId: null, categoryName: null });
  };

  const handleCloseEdit = () => {
    setEditDialog({ open: false, categoryId: null });
  };

  const handleSubmitCategory = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      if (editDialog.categoryId) {
        await updateCategoryMutation.mutateAsync({
          id: editDialog.categoryId,
          data,
        });
      } else {
        await createCategoryMutation.mutateAsync(data);
      }
      handleCloseEdit();
      refetch();
    } catch (error: any) {
      console.error('Error saving article:', error);
      // Обработка ошибки slug
      if (error?.response?.data?.error === 'SLUG_ALREADY_EXISTS') {
        setSlugError(error.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCategoryDeleting = (categoryId: string) => {
    return (
      deleteCategoryMutation.isPending &&
      deleteCategoryMutation.variables === categoryId
    );
  };

  if (isError) {
    return (
      <UniversalError
        error={error}
        onRetry={refetch}
        title="Error loading categories"
        icon={<ChartColumnStacked className="h-12 w-12 mx-auto" />}
        data-testid="categories-error-state"
        aria-live="polite"
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-6"
      data-testid="dashboard-categories"
      role="main"
      aria-label="Categories management dashboard"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          role="region"
          aria-label="Page header"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {DASHBOARD_CATEGORIES_CONFIG.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {DASHBOARD_CATEGORIES_CONFIG.subtitle}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              disabled={isLoading || isFetching}
              className="gap-2 cursor-pointer"
              aria-label="Refresh categories list"
              aria-busy={isLoading || isFetching}
              data-testid="refresh-categories-button"
            >
              {isLoading || isFetching ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Refreshing...</span>
                </>
              ) : (
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              )}
              Refresh
            </Button>

            <Button
              onClick={handleCreateCategory}
              size="sm"
              className="gap-2 cursor-pointer"
              aria-label="Create new category"
              data-testid="create-category-button"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New Category
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle
              className="flex items-center gap-2"
              id="categories-section-title"
            >
              <ChartColumnStacked className="h-5 w-5" aria-hidden="true" />
              Categories
            </CardTitle>
            <CardDescription aria-live="polite">
              {isLoading
                ? 'Loading categories...'
                : `${categories?.length || 0} total categories`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div
                className="space-y-3"
                aria-label="Loading categories"
                aria-busy="true"
                data-testid="categories-loading-state"
              >
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-muted animate-pulse rounded-lg"
                    aria-hidden="true"
                    data-testid={`skeleton-row-${i}`}
                  />
                ))}
                <span className="sr-only">Loading categories, please wait</span>
              </div>
            ) : categories?.length === 0 ? (
              <UniversalEmpty
                icon={<ChartColumnStacked className="h-12 w-12" />}
                title="No categories found"
                description="Get started by creating your first category"
                data-testid="categories-empty-state"
                aria-live="polite"
              >
                <Button
                  onClick={handleCreateCategory}
                  className="mt-4"
                  aria-label="Create your first category"
                >
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Create Category
                </Button>
              </UniversalEmpty>
            ) : (
              <div
                className="space-y-3"
                role="feed"
                aria-label="Categories list"
                aria-busy={deleteCategoryMutation.isPending}
                data-testid="categories-list"
                data-categories-count={categories?.length}
              >
                {categories?.map((category, index) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteClick}
                    isDeleting={isCategoryDeleting(category.id)}
                    aria-posinset={index + 1}
                    aria-setsize={categories.length}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) handleCancelDelete();
        }}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteDialog.categoryName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={
          deleteCategoryMutation.isPending &&
          deleteDialog.categoryId === deleteCategoryMutation.variables
        }
        data-testid="delete-category-dialog"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      />

      {/* Category Form Sheet */}
      <SheetForm
        open={editDialog.open}
        onOpenChange={handleCloseEdit}
        id={editDialog.categoryId}
        isLoading={isLoadingCategory}
        error={categoryError}
        slugError={slugError}
        onRetry={() => refetchCategory()}
        aria-label={
          editDialog.categoryId ? 'Edit category form' : 'Create category form'
        }
        data-testid="category-form-sheet"
        data-mode={editDialog.categoryId ? 'edit' : 'create'}
        data-category-id={editDialog.categoryId || undefined}
      >
        <CategoryForm
          initialData={category}
          onSubmit={handleSubmitCategory}
          isSubmitting={isSubmitting}
        />
      </SheetForm>
    </div>
  );
};

'use client';

import { useState } from 'react';
import { ChartColumnStacked, Loader2, Plus, RefreshCw } from 'lucide-react';

import { useCategories } from '@/entities/dashboard-get-categories';
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import {
  useCategory,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '../hooks';
import { CategoryFormValues } from '../model';
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

  const {
    data: categories,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCategories();

  const { data: category } = useCategory(editDialog.categoryId);
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
    } catch (error) {
      console.error('Error saving category:', error);
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
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-6"
      data-testid="dashboard-categories"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
              className="gap-2"
              aria-label="Refresh categories list"
            >
              {isLoading || isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>

            <Button
              onClick={handleCreateCategory}
              size="sm"
              className="gap-2"
              data-testid="create-category-button"
            >
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartColumnStacked className="h-5 w-5" />
              Categories
            </CardTitle>
            <CardDescription>
              {isLoading
                ? 'Loading categories...'
                : `${categories?.length || 0} total categories`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : categories?.length === 0 ? (
              <UniversalEmpty
                icon={<ChartColumnStacked className="h-12 w-12" />}
                title="No categories found"
                description="Get started by creating your first category"
                data-testid="categories-empty-state"
              >
                <Button onClick={handleCreateCategory} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              </UniversalEmpty>
            ) : (
              <div className="space-y-3">
                {categories?.map((category) => (
                  <CategoryRow
                    key={category.id}
                    category={category}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteClick}
                    isDeleting={isCategoryDeleting(category.id)}
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
      />

      {/* Category Form Sheet */}
      <Sheet open={editDialog.open} onOpenChange={handleCloseEdit}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto p-4"
        >
          <SheetHeader>
            <SheetTitle>
              {editDialog.categoryId ? 'Edit Category' : 'Create Category'}
            </SheetTitle>
            <SheetDescription>
              {editDialog.categoryId
                ? 'Make changes to your category'
                : 'Create a new category for your blog posts'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <CategoryForm
              initialData={category}
              onSubmit={handleSubmitCategory}
              isSubmitting={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

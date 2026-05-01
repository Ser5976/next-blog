'use client';

import { useState } from 'react';
import { Loader2, Plus, RefreshCw, Tags } from 'lucide-react';

import { useTags } from '@/entities/dashboard-get-tags';
import { SheetForm } from '@/shared/components';
import { TagFormValues } from '@/shared/schemas';
import { ConfirmDialog, UniversalEmpty, UniversalError } from '@/shared/ui';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { useCreateTag, useDeleteTag, useTag, useUpdateTag } from '../hooks';
import { TagForm } from './tag-form';
import { TagRow } from './tag-row';

const DASHBOARD_TAGS_CONFIG = {
  title: 'Tags Management',
  subtitle: 'Create, edit, and manage your blog tags',
} as const;

export const DashboardTags = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    tagId: string | null;
  }>({ open: false, tagId: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    tagId: string | null;
    tagName: string | null;
  }>({ open: false, tagId: null, tagName: null });
  const [slugError, setSlugError] = useState<string | null>(null);

  const {
    data: tags,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useTags();

  const {
    data: tag,
    isLoading: isLoadingTag,
    error: tagError,
    refetch: refetchTag,
  } = useTag(editDialog.tagId);
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  const handleCreateTag = () => {
    setSlugError(null);
    setEditDialog({ open: true, tagId: null });
  };

  const handleEditTag = (id: string) => {
    setSlugError(null);
    setEditDialog({ open: true, tagId: id });
  };

  const handleDeleteClick = (tagId: string, tagName: string) => {
    setDeleteDialog({
      open: true,
      tagId,
      tagName,
    });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.tagId) {
      deleteTagMutation.mutate(deleteDialog.tagId, {
        onSettled: () => {
          setDeleteDialog({
            open: false,
            tagId: null,
            tagName: null,
          });
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ open: false, tagId: null, tagName: null });
  };

  const handleCloseEdit = () => {
    setSlugError(null);
    setEditDialog({ open: false, tagId: null });
  };

  const handleSubmitTag = async (data: TagFormValues) => {
    setIsSubmitting(true);
    setSlugError(null);
    try {
      if (editDialog.tagId) {
        await updateTagMutation.mutateAsync({
          id: editDialog.tagId,
          data,
        });
      } else {
        await createTagMutation.mutateAsync(data);
      }
      handleCloseEdit();
      refetch();
    } catch (error: any) {
      console.error('Error saving tag:', error);
      // Обработка ошибки slug для тегов
      if (error?.response?.data?.error === 'SLUG_ALREADY_EXISTS') {
        setSlugError(error.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTagDeleting = (tagId: string) => {
    return deleteTagMutation.isPending && deleteTagMutation.variables === tagId;
  };

  if (isError) {
    return (
      <UniversalError
        error={error}
        onRetry={refetch}
        title="Error loading tags"
        icon={<Tags className="h-12 w-12 mx-auto" />}
        data-testid="tags-error-state"
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-6"
      data-testid="dashboard-tags"
      role="main"
      aria-label="Tags management dashboard"
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
              {DASHBOARD_TAGS_CONFIG.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {DASHBOARD_TAGS_CONFIG.subtitle}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              variant="outline"
              size="sm"
              disabled={isLoading || isFetching}
              className="gap-2 cursor-pointer"
              aria-label="Refresh tags list"
              aria-busy={isLoading || isFetching}
              data-testid="refresh-tags-button"
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
              onClick={handleCreateTag}
              size="sm"
              className="gap-2 cursor-pointer"
              aria-label="Create new tag"
              data-testid="create-tag-button"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New Tag
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle
              className="flex items-center gap-2"
              id="tags-section-title"
            >
              <Tags className="h-5 w-5" aria-hidden="true" />
              Tags
            </CardTitle>
            <CardDescription aria-live="polite">
              {isLoading
                ? 'Loading tags...'
                : `${tags?.length || 0} total tags`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div
                className="space-y-3"
                aria-label="Loading tags"
                aria-busy="true"
                data-testid="tags-loading-state"
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-muted animate-pulse rounded-lg"
                    aria-hidden="true"
                    data-testid={`skeleton-row-${i}`}
                  />
                ))}
                <span className="sr-only">Loading tags, please wait</span>
              </div>
            ) : tags?.length === 0 ? (
              <UniversalEmpty
                icon={<Tags className="h-12 w-12" />}
                title="No tags found"
                description="Get started by creating your first tag"
                data-testid="tags-empty-state"
                aria-live="polite"
              >
                <Button
                  onClick={handleCreateTag}
                  className="mt-4"
                  aria-label="Create your first tag"
                >
                  <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                  Create Tag
                </Button>
              </UniversalEmpty>
            ) : (
              <div
                className="space-y-3"
                role="feed"
                aria-label="Tags list"
                aria-busy={deleteTagMutation.isPending}
                data-testid="tags-list"
                data-tags-count={tags?.length}
              >
                {tags?.map((tag, index) => (
                  <TagRow
                    key={tag.id}
                    tag={tag}
                    onEdit={handleEditTag}
                    onDelete={handleDeleteClick}
                    isDeleting={isTagDeleting(tag.id)}
                    aria-posinset={index + 1}
                    aria-setsize={tags.length}
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
        title="Delete Tag"
        description={`Are you sure you want to delete "${deleteDialog.tagName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={
          deleteTagMutation.isPending &&
          deleteDialog.tagId === deleteTagMutation.variables
        }
        data-testid="delete-tag-dialog"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      />

      {/* Tag Form Sheet */}
      <SheetForm
        open={editDialog.open}
        onOpenChange={handleCloseEdit}
        id={editDialog.tagId}
        isLoading={isLoadingTag}
        error={tagError}
        slugError={slugError}
        onRetry={() => refetchTag()}
        entityType="tag"
        aria-label={editDialog.tagId ? 'Edit tag form' : 'Create tag form'}
        data-testid="tag-form-sheet"
        data-mode={editDialog.tagId ? 'edit' : 'create'}
        data-tag-id={editDialog.tagId || undefined}
      >
        <TagForm
          initialData={tag}
          onSubmit={handleSubmitTag}
          isSubmitting={isSubmitting}
        />
      </SheetForm>
    </div>
  );
};

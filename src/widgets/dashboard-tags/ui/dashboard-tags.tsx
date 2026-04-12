'use client';

import { useState } from 'react';
import { Loader2, Plus, RefreshCw, Tags } from 'lucide-react';

import { useTags } from '@/entities/dashboard-get-tags';
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
import { useCreateTag, useDeleteTag, useTag, useUpdateTag } from '../hooks';
import { TagFormValues } from '../model';
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

  const {
    data: tags,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useTags();

  const { data: tag } = useTag(editDialog.tagId);
  const createTagMutation = useCreateTag();
  const updateTagMutation = useUpdateTag();
  const deleteTagMutation = useDeleteTag();

  const handleCreateTag = () => {
    setEditDialog({ open: true, tagId: null });
  };

  const handleEditTag = (id: string) => {
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
    setEditDialog({ open: false, tagId: null });
  };

  const handleSubmitTag = async (data: TagFormValues) => {
    setIsSubmitting(true);
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
    } catch (error) {
      console.error('Error saving tag:', error);
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
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
              className="gap-2"
              aria-label="Refresh tags list"
            >
              {isLoading || isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </Button>

            <Button
              onClick={handleCreateTag}
              size="sm"
              className="gap-2"
              data-testid="create-tag-button"
            >
              <Plus className="h-4 w-4" />
              New Tag
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tags className="h-5 w-5" />
              Tags
            </CardTitle>
            <CardDescription>
              {isLoading
                ? 'Loading tags...'
                : `${tags?.length || 0} total tags`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : tags?.length === 0 ? (
              <UniversalEmpty
                icon={<Tags className="h-12 w-12" />}
                title="No tags found"
                description="Get started by creating your first tag"
                data-testid="tags-empty-state"
              >
                <Button onClick={handleCreateTag} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Tag
                </Button>
              </UniversalEmpty>
            ) : (
              <div className="space-y-3">
                {tags?.map((tag) => (
                  <TagRow
                    key={tag.id}
                    tag={tag}
                    onEdit={handleEditTag}
                    onDelete={handleDeleteClick}
                    isDeleting={isTagDeleting(tag.id)}
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
      />

      {/* Tag Form Sheet */}
      <Sheet open={editDialog.open} onOpenChange={handleCloseEdit}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto p-4"
        >
          <SheetHeader>
            <SheetTitle>
              {editDialog.tagId ? 'Edit Tag' : 'Create Tag'}
            </SheetTitle>
            <SheetDescription>
              {editDialog.tagId
                ? 'Make changes to your tag'
                : 'Create a new tag for your blog posts'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <TagForm
              initialData={tag}
              onSubmit={handleSubmitTag}
              isSubmitting={isSubmitting}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

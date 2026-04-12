'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Loader2, Plus, RefreshCw } from 'lucide-react';

import { useCategories } from '@/entities/dashboard-get-categories';
import { useTags } from '@/entities/dashboard-get-tags';
import {
  ConfirmDialog,
  ListSkeleton,
  Pagination,
  UniversalEmpty,
  UniversalError,
} from '@/shared/ui';
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
import { useArticlesManagement } from '../hooks';
import { DASHBOARD_ARTICLES_CONFIG } from '../lib';
import { ArticleFormValues } from '../model';
import { ArticleForm } from './article-form';
import { ArticleRow } from './article-row';
import { ArticlesFiltersComponent } from './articles-filters';

export const DashboardArticles = () => {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    article,
    filters,
    deleteDialog,
    editDialog,
    articles,
    total,
    page,
    totalPages,
    isLoading,
    isError,
    error,
    isFetching,
    debouncedSearch,
    createArticlesMutation,
    deleteArticleMutation,
    updateArticlMutation,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleCloseEdit,
    handleTogglePublish,
    handlePageChange,
    handleItemsPerPageChange,
    handleFiltersChange,
    handleRefresh,
    handlePrefetchNextPage,
    setEditDialog,
    isArticleDeleting,
    isArticleToggling,
  } = useArticlesManagement();
  const isArticle = editDialog.articleId ? !!article : true;

  const { data: categories } = useCategories();
  const { data: tags } = useTags();

  const handleCreateArticle = () => {
    setEditDialog({ open: true, articleId: null });
  };

  const handleEditArticle = (id: string) => {
    setEditDialog({ open: true, articleId: id });
  };

  const handleSubmitArticle = async (data: ArticleFormValues) => {
    setIsSubmitting(true);
    try {
      if (editDialog.articleId) {
        await updateArticlMutation.mutateAsync({
          id: editDialog.articleId,
          data,
        });
      } else {
        await createArticlesMutation.mutateAsync(data);
      }
      handleCloseEdit();
      handleRefresh();
      router.push('/dashboard/articles');
    } catch (error) {
      console.error('Error saving article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isError) {
    return (
      <UniversalError
        error={error}
        onRetry={handleRefresh}
        title="Error loading articles"
        icon={<FileText className="h-12 w-12 mx-auto" />}
        data-testid="articles-error-state"
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-background p-4 md:p-6"
      data-testid="dashboard-articles"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {DASHBOARD_ARTICLES_CONFIG.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {DASHBOARD_ARTICLES_CONFIG.subtitle}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isLoading || isFetching}
              className="gap-2"
              aria-label="Refresh articles list"
              data-testid="refresh-articles-button"
            >
              {isLoading || isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              )}
              Refresh
            </Button>

            <Button
              onClick={handleCreateArticle}
              size="sm"
              className="gap-2"
              data-testid="create-article-button"
            >
              <Plus className="h-4 w-4" />
              New Article
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Card data-testid="articles-card">
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                  Articles
                </CardTitle>
                <CardDescription data-testid="articles-count">
                  {isLoading
                    ? 'Loading articles...'
                    : `${total.toLocaleString()} total articles`}
                </CardDescription>
              </div>

              {/* Top Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={filters.limit}
                pageSizeOptions={[1, 3, 5, 10, 20, 50, 100]}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                className="mt-0"
                data-testid="pagination-top"
              />
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Filters */}
            <ArticlesFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
              categories={categories}
              tags={tags}
            />

            {/* Articles List */}
            <div
              onMouseEnter={handlePrefetchNextPage}
              role="region"
              aria-label="Articles list"
              data-testid="articles-list-container"
              className="mt-6"
            >
              {isLoading ? (
                <ListSkeleton data-testid="articles-loading" />
              ) : articles.length === 0 ? (
                <UniversalEmpty
                  searchQuery={debouncedSearch}
                  icon={<FileText className="h-12 w-12" aria-hidden="true" />}
                  title="No articles found"
                  description={
                    debouncedSearch
                      ? `No articles matching "${debouncedSearch}"`
                      : 'Get started by creating your first article'
                  }
                  data-testid="articles-empty-state"
                >
                  {!debouncedSearch && (
                    <Button onClick={handleCreateArticle} className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Article
                    </Button>
                  )}
                </UniversalEmpty>
              ) : (
                <div
                  className="space-y-3"
                  role="list"
                  aria-label="Article list items"
                  data-testid="articles-list"
                >
                  {articles.map((article) => (
                    <ArticleRow
                      key={article.id}
                      article={article}
                      onEdit={handleEditArticle}
                      onDelete={handleDeleteClick}
                      onTogglePublish={handleTogglePublish}
                      isDeleting={isArticleDeleting(article.id)}
                      isToggling={isArticleToggling(article.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Pagination */}
            <div className="border-t pt-6 mt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={total}
                itemsPerPage={filters.limit}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                data-testid="pagination-bottom"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) handleCancelDelete();
        }}
        title="Delete Article"
        description={`Are you sure you want to delete "${deleteDialog.articleTitle}"? This action cannot be undone. It will also delete all comments and ratings associated with this article.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={
          deleteArticleMutation?.isPending &&
          deleteDialog.articleId === deleteArticleMutation?.variables
        }
        data-testid="delete-article-dialog"
      />

      {/* Article Form Sheet */}
      <Sheet open={editDialog.open && isArticle} onOpenChange={handleCloseEdit}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-7xl overflow-y-auto p-2"
        >
          <SheetHeader>
            <SheetTitle>
              {editDialog.articleId ? 'Edit Article' : 'Create Article'}
            </SheetTitle>
            <SheetDescription>
              {editDialog.articleId
                ? 'Make changes to your article'
                : 'Create a new article for your blog'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6">
            <ArticleForm
              initialData={
                article
                  ? {
                      title: article.title,
                      slug: article.slug,
                      content: article.content,
                      excerpt: article.excerpt || '',
                      coverImage: article.coverImage,
                      categoryId: article.categoryId,
                      tags: article.tags.map((tag) => tag.id),
                    }
                  : undefined
              }
              onSubmit={handleSubmitArticle}
              isSubmitting={isSubmitting}
              categories={categories}
              availableTags={tags}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

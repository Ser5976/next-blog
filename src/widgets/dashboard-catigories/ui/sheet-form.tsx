'use client';

import { ReactNode } from 'react';

import { UniversalError } from '@/shared/ui';
import { LoadingScreen } from '@/shared/ui/loading-screen';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';

interface SheetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string | null;
  isLoading: boolean;
  error: Error | null;
  slugError?: string | null;
  onRetry: () => void;
  children: ReactNode;
}

export const SheetForm = ({
  open,
  onOpenChange,
  categoryId,
  isLoading,
  error,
  slugError,
  onRetry,
  children,
}: SheetFormProps) => {
  const isEditing = !!categoryId;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto p-4"
        aria-label={isEditing ? 'Edit category form' : 'Create category form'}
        data-testid="category-sheet-content"
      >
        <SheetHeader>
          <SheetTitle data-testid="sheet-title">
            {isEditing ? 'Edit Category' : 'Create Category'}
          </SheetTitle>
          <SheetDescription data-testid="sheet-description">
            {isEditing
              ? 'Make changes to your category'
              : 'Create a new category for your blog posts'}
          </SheetDescription>
        </SheetHeader>

        {/* Slug Error */}
        {slugError && (
          <div
            className="mt-4 mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg"
            role="alert"
            aria-live="assertive"
            data-testid="slug-error-container"
          >
            <p
              className="text-destructive text-sm"
              data-testid="slug-error-message"
            >
              <strong>Error:</strong> {slugError}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            aria-label="Loading category data"
            data-testid="loading-state"
          >
            <LoadingScreen
              title="Loading category..."
              text="Please wait while we fetch the category data"
            />
          </div>
        ) : error ? (
          /* Error State */
          <div
            className="min-h-screen bg-background p-4 md:p-6"
            role="alert"
            aria-live="assertive"
            aria-label="Error loading category"
            data-testid="error-state"
          >
            <UniversalError
              error={error}
              message={error.message}
              title="Failed to Load Category"
              onRetry={onRetry}
              variant="card"
              data-testid="load-error"
            >
              <p
                className="text-xs text-muted-foreground mt-4"
                data-testid="error-category-id"
              >
                Category ID: {categoryId}
              </p>
            </UniversalError>
          </div>
        ) : (
          /* Form Children */
          <div className="mt-6" data-testid="form-children-container">
            {children}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

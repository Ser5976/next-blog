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
  id: string | null;
  isLoading: boolean;
  error: Error | null;
  slugError?: string | null;
  onRetry: () => void;
  children: ReactNode;
  title?: {
    create: string;
    edit: string;
  };
  description?: {
    create: string;
    edit: string;
  };
  entityType?: 'category' | 'tag';
}

const DEFAULT_TITLES = {
  category: {
    create: 'Create Category',
    edit: 'Edit Category',
  },
  tag: {
    create: 'Create Tag',
    edit: 'Edit Tag',
  },
} as const;

const DEFAULT_DESCRIPTIONS = {
  category: {
    create: 'Create a new category for your blog posts',
    edit: 'Make changes to your category',
  },
  tag: {
    create: 'Create a new tag for your blog posts',
    edit: 'Make changes to your tag',
  },
} as const;

export const SheetForm = ({
  open,
  onOpenChange,
  id,
  isLoading,
  error,
  slugError,
  onRetry,
  children,
  title,
  description,
  entityType = 'category',
}: SheetFormProps) => {
  const isEditing = !!id;

  const finalTitle = title
    ? isEditing
      ? title.edit
      : title.create
    : isEditing
      ? DEFAULT_TITLES[entityType].edit
      : DEFAULT_TITLES[entityType].create;

  const finalDescription = description
    ? isEditing
      ? description.edit
      : description.create
    : isEditing
      ? DEFAULT_DESCRIPTIONS[entityType].edit
      : DEFAULT_DESCRIPTIONS[entityType].create;

  const getAriaLabel = () => {
    if (entityType === 'tag') {
      return isEditing ? 'Edit tag form' : 'Create tag form';
    }
    return isEditing ? 'Edit category form' : 'Create category form';
  };

  const getTestId = () => {
    if (entityType === 'tag') {
      return 'tag-sheet-content';
    }
    return 'category-sheet-content';
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg overflow-y-auto p-4"
        aria-label={getAriaLabel()}
        data-testid={getTestId()}
      >
        <SheetHeader>
          <SheetTitle data-testid="sheet-title">{finalTitle}</SheetTitle>
          <SheetDescription data-testid="sheet-description">
            {finalDescription}
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
            aria-label={`Loading ${entityType} data`}
            data-testid="loading-state"
          >
            <LoadingScreen
              title={`Loading ${entityType}...`}
              text={`Please wait while we fetch the ${entityType} data`}
            />
          </div>
        ) : error ? (
          /* Error State */
          <div
            className="min-h-[400px] bg-background p-4 md:p-6"
            role="alert"
            aria-live="assertive"
            aria-label={`Error loading ${entityType}`}
            data-testid="error-state"
          >
            <UniversalError
              error={error}
              message={error.message}
              title={`Failed to Load ${entityType === 'tag' ? 'Tag' : 'Category'}`}
              onRetry={onRetry}
              variant="card"
              data-testid="load-error"
            >
              <p
                className="text-xs text-muted-foreground mt-4"
                data-testid="error-id"
              >
                {entityType === 'tag' ? 'Tag' : 'Category'} ID: {id}
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

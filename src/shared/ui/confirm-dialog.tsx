'use client';

import { Loader2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './alert-dialog';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  'data-testid'?: string;
  'aria-label'?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
  isLoading = false,
  'data-testid': testId = 'confirm-dialog',
  'aria-label': ariaLabel = 'Confirmation dialog',
}: ConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      aria-label={ariaLabel}
      data-testid={testId}
    >
      <AlertDialogContent data-testid="confirm-dialog-content">
        <AlertDialogHeader>
          <AlertDialogTitle data-testid="confirm-dialog-title">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription data-testid="confirm-dialog-description">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className=" cursor-pointer"
            onClick={onCancel}
            disabled={isLoading}
            data-testid="confirm-dialog-cancel"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={
              variant === 'destructive'
                ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer'
                : ''
            }
            data-testid="confirm-dialog-confirm"
            aria-label={isLoading ? 'Processing...' : confirmText}
          >
            {isLoading ? (
              <>
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                  data-testid="loading-spinner"
                />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

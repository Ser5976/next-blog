import { cn } from '@/shared/lib/utils';

export const CardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-gray-200 bg-white p-4',
        className
      )}
    >
      <div className="mb-4 aspect-video animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
      <div className="mb-2 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mb-2 h-6 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      <div className="mb-3 h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      <div className="flex gap-2">
        <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
};

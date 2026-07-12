import { cn } from '@/shared/lib';

interface StatsSkeletonProps {
  className?: string;
  'data-testid'?: string;
  ariaLabel?: string;
}

export const StatsSkeleton = ({
  className,
  'data-testid': dataTestId = 'stats-skeleton',
  ariaLabel = 'Loading statistics',
}: StatsSkeletonProps) => {
  return (
    <div
      className={cn('space-y-2', className)}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
      aria-atomic="true"
      data-testid={dataTestId}
    >
      <div
        className="h-8 w-16 animate-pulse rounded bg-emerald-400/20"
        aria-hidden="true"
        data-testid={`${dataTestId}-bar`}
      />
      <div
        className="h-4 w-20 animate-pulse rounded bg-gray-400/20"
        aria-hidden="true"
        data-testid={`${dataTestId}-label`}
      />
    </div>
  );
};

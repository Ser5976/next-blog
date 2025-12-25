interface SimpleListSkeletonProps {
  count?: number;
  className?: string;
  itemClassName?: string;
  'data-testid'?: string;
}

export function ListSkeleton({
  count = 5,
  className = '',
  itemClassName = '',
  'data-testid': testId = 'list-skeleton',
}: SimpleListSkeletonProps) {
  return (
    <div
      className={`space-y-4 ${className}`}
      role="status"
      aria-label="Loading content"
      aria-busy="true"
      data-testid={testId}
    >
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`h-20 bg-gradient-to-r from-muted/70 to-muted animate-pulse rounded-lg ${itemClassName}`}
          data-testid="skeleton-item"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

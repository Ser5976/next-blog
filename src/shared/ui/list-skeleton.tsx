// Упрощенная версия
interface SimpleListSkeletonProps {
  count?: number;
  className?: string;
  itemClassName?: string;
}

export function ListSkeleton({
  count = 5,
  className = '',
  itemClassName = '',
}: SimpleListSkeletonProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`h-20 bg-gradient-to-r from-muted/70 to-muted animate-pulse rounded-lg ${itemClassName}`}
        />
      ))}
    </div>
  );
}

export function UsersSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="h-20 bg-gradient-to-r from-muted/70 to-muted animate-pulse rounded-lg"
        />
      ))}
    </div>
  );
}

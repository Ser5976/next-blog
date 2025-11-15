import { Card, CardContent, CardHeader } from '@/shared/ui/card';

export const SkeletonLoader = ({ className = '' }: { className?: string }) => (
  <Card className={`relative overflow-hidden animate-pulse ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <div className="h-4 bg-gray-200 rounded w-24"></div>
      <div className="h-4 w-4 bg-gray-200 rounded"></div>
    </CardHeader>
    <CardContent>
      <div className="h-7 bg-gray-200 rounded w-16 mb-2"></div>
      <div className="flex items-center space-x-1 mb-1">
        <div className="h-3 w-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-12"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-32"></div>
    </CardContent>
  </Card>
);

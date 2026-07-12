import { AlertCircle } from 'lucide-react';

import { cn } from '@/shared/lib';

interface StatsErrorProps {
  label: string;
  className?: string;
  'data-testid'?: string;
}

export const StatsError = ({
  label,
  className,
  'data-testid': dataTestId = 'stats-error',
}: StatsErrorProps) => {
  return (
    <div
      className={cn('space-y-2', className)}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      aria-label={`Error: ${label}`}
      data-testid={dataTestId}
    >
      <div className="flex items-center gap-2">
        <AlertCircle
          className="h-5 w-5 text-red-400"
          aria-hidden="true"
          data-testid={`${dataTestId}-icon`}
        />
        <div
          className="text-2xl font-bold text-red-400"
          aria-hidden="true"
          data-testid={`${dataTestId}-dash`}
        >
          —
        </div>
      </div>
      <div
        className="text-sm text-gray-400"
        data-testid={`${dataTestId}-message`}
      >
        {label}
      </div>
    </div>
  );
};

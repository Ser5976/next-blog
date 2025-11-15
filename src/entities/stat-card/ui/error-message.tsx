import { AlertCircle } from 'lucide-react';

import { Card, CardContent } from '@/shared/ui/card';
import { IErrorMessage } from '../model';

export const ErrorMessage = ({
  title = 'Error',
  message,
  onRetry,
  className = '',
}: IErrorMessage) => (
  <Card className={className}>
    <CardContent className="pt-6">
      <div className="flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-8 w-8 text-red-500 mb-3" />
        <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-600 mb-3">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </CardContent>
  </Card>
);

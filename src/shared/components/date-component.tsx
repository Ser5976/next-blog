'use client';

import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';

import { formatDate } from '@/shared/lib';

interface DateComponentProps {
  date: string | Date | number | null;
  className?: string;
  'data-testid'?: string;
}

export const DateComponent = ({
  date,
  className = '',
  'data-testid': dataTestId = 'date',
}: DateComponentProps) => {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    setFormattedDate(formatDate(date));
  }, [date]);

  // Во время SSR показываем заглушку, чтобы избежать гидратации
  if (!formattedDate) {
    return (
      <div
        className={`flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 ${className}`}
      >
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        <span data-testid={dataTestId}>&nbsp;</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 ${className}`}
    >
      <CalendarDays className="h-4 w-4" aria-hidden="true" />
      <span data-testid={dataTestId}>{formattedDate}</span>
    </div>
  );
};

'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/shared/ui';

export function TimeFilter({
  initialPeriod,
}: {
  initialPeriod: 'week' | 'month' | 'year';
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePeriodChange = (period: 'week' | 'month' | 'year') => {
    const params = new URLSearchParams(searchParams);
    params.set('timeRange', period);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={initialPeriod === 'week' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePeriodChange('week')}
      >
        Week
      </Button>
      <Button
        variant={initialPeriod === 'month' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePeriodChange('month')}
      >
        Month
      </Button>
      <Button
        variant={initialPeriod === 'year' ? 'default' : 'outline'}
        size="sm"
        onClick={() => handlePeriodChange('year')}
      >
        Year
      </Button>
    </div>
  );
}

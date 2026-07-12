import { getCategories } from '@/entities/category';
import { StatsError } from './stats-error';

interface CategoriesStatsProps {
  'data-testid'?: string;
}

export const CategoriesStats = async ({
  'data-testid': dataTestId = 'categories-stats',
}: CategoriesStatsProps = {}) => {
  const categories = await getCategories();

  if (categories === undefined) {
    return <StatsError label="Topics" data-testid={`${dataTestId}-error`} />;
  }

  const count = categories.length === 0 ? 0 : categories.length;
  const ariaLabel =
    count === 0 ? 'No topics available' : `${count} topics available`;

  return (
    <div
      className="space-y-2"
      role="status"
      aria-label="Topics statistics"
      aria-live="polite"
      aria-atomic="true"
      data-testid={dataTestId}
    >
      <div
        className="text-2xl font-bold text-emerald-400"
        aria-label={ariaLabel}
        data-testid={`${dataTestId}-count`}
      >
        {count}+
      </div>
      <div
        className="text-sm text-gray-400"
        aria-hidden="true"
        data-testid={`${dataTestId}-label`}
      >
        Topics
      </div>
    </div>
  );
};

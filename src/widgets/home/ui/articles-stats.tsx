import { getArticlesServer } from '@/entities/get-articles/api';
import { StatsError } from './stats-error';

interface ArticlesStatsProps {
  'data-testid'?: string;
}

export const ArticlesStats = async ({
  'data-testid': dataTestId = 'articles-stats',
}: ArticlesStatsProps = {}) => {
  const data = await getArticlesServer({
    page: 1,
    limit: 1,
    published: true,
  });

  if (data === null) {
    return (
      <StatsError label="Health Articles" data-testid={`${dataTestId}-error`} />
    );
  }

  return (
    <div
      className="space-y-2"
      role="status"
      aria-label="Health articles statistics"
      aria-live="polite"
      aria-atomic="true"
      data-testid={dataTestId}
    >
      <div
        className="text-2xl font-bold text-emerald-400"
        aria-label={`${data.total} health articles available`}
        data-testid={`${dataTestId}-count`}
      >
        {data.total}+
      </div>
      <div
        className="text-sm text-gray-400"
        aria-hidden="true"
        data-testid={`${dataTestId}-label`}
      >
        Health Articles
      </div>
    </div>
  );
};

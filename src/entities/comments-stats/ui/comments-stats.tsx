import { commentsStatsItems } from '../lib';
import { CommentsStatsProps } from '../model';

export function CommentsStats({ stats }: CommentsStatsProps) {
  const STATS_ITEMS = commentsStatsItems(stats);

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4"
      role="region"
      aria-label="User comments statistics"
    >
      {STATS_ITEMS.map((item, index) => (
        <div
          key={index}
          className="bg-muted/30 rounded-lg p-3 text-center"
          data-testid={item.testId}
          aria-label={item.ariaLabel}
        >
          <div
            className="font-bold text-xl sm:text-2xl"
            data-testid={`${item.testId}-value`}
          >
            {item.value}
          </div>
          <div
            className="text-xs text-muted-foreground"
            data-testid={`${item.testId}-label`}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

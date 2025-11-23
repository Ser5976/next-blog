import { ArrowDown, ArrowUp } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { IStatCard } from '../model';

export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
}: IStatCard) => (
  <Card
    className="relative overflow-hidden"
    role="region"
    aria-labelledby={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle
        className="text-sm font-medium"
        id={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold" aria-live="polite">
        {value}
      </div>
      {trend && (
        <div
          className={`flex items-center text-xs ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
          role="status"
          aria-label={`Trend is ${trend >= 0 ? 'up' : 'down'} by ${Math.abs(trend)} percent from the previous period`}
        >
          {trend >= 0 ? (
            <ArrowUp className="h-3 w-3" aria-hidden="true" />
          ) : (
            <ArrowDown className="h-3 w-3" aria-hidden="true" />
          )}
          <span>{Math.abs(trend)}% from the previous period</span>
        </div>
      )}
      <p
        className="text-xs text-muted-foreground mt-1"
        aria-describedby={`stat-title-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        {description}
      </p>
    </CardContent>
  </Card>
);

export const ErrorMessage = ({ message }: { message: string }) => (
  <Card role="alert" aria-live="assertive">
    <CardContent className="pt-6">
      <div
        className="text-center text-red-600"
        aria-label={`Error: ${message}`}
      >
        {message}
      </div>
    </CardContent>
  </Card>
);

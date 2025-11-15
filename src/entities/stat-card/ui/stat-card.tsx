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
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <div
          className={`flex items-center text-xs ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
        >
          {trend >= 0 ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          {Math.abs(trend)}% с прошлого периода
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

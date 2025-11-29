import { TimeRageType } from '@/entities/time-range';

export interface DashboardOverviewProps {
  timeRange: TimeRageType;
}

export interface DashboardOverviewConfig {
  title: string;
  subtitle: string;
  maxWidth: string;
}

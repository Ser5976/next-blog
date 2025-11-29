import { TimeRageType } from '@/entities/time-range';

export interface IViewStats {
  totalViews: { current: number; previous: number; change: number };
}
export interface IViewStatsProps {
  timeRange: TimeRageType;
}

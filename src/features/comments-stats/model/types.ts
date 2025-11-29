import { TimeRageType } from '@/entities/time-range';

export interface ICommentsStats {
  totalComments: { current: number; previous: number; change: number };
}

export interface ICommentsProps {
  timeRange: TimeRageType;
}

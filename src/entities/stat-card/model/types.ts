import { LucideIcon } from 'lucide-react';

export interface IStatCard {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  description: string;
}

export interface IErrorMessage {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

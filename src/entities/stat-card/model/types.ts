import { LucideIcon } from 'lucide-react';

export interface IStatCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  description: string;
}

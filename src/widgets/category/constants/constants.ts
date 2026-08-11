import {
  Activity,
  Apple,
  Dumbbell,
  Leaf,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

export const categoryIcons: Record<
  string,
  { icon: any; color: string; gradient: string }
> = {
  nutrition: {
    icon: Apple,
    color: 'text-lime-500',
    gradient: 'from-lime-500/20 to-emerald-500/20',
  },
  fitness: {
    icon: Dumbbell,
    color: 'text-teal-500',
    gradient: 'from-teal-500/20 to-cyan-500/20',
  },
  medicine: {
    icon: Stethoscope,
    color: 'text-red-500',
    gradient: 'from-red-500/20 to-rose-500/20',
  },
  health: {
    icon: Leaf,
    color: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
  lifestyle: {
    icon: Sparkles,
    color: 'text-amber-500',
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
};

export const defaultIcon = {
  icon: Activity,
  color: 'text-blue-500',
  gradient: 'from-blue-500/20 to-indigo-500/20',
};

export const ARTICLES_PER_PAGE = 2;

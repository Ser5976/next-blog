import {
  Activity,
  Apple,
  Book,
  Brain,
  Coffee,
  Compass,
  Dumbbell,
  Flame,
  Gift,
  Globe,
  Hash,
  Heart,
  HeartPulse,
  Leaf,
  Lock,
  Moon,
  PillBottle,
  Scale,
  Shield,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy,
  User,
  Users,
  Wifi,
  Wrench,
} from 'lucide-react';

// Маппинг иконок для тегов
export const tagIcons: Record<
  string,
  { icon: any; color: string; gradient: string }
> = {
  // Здоровье и фитнес
  health: {
    icon: Heart,
    color: 'text-rose-500',
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  fitness: {
    icon: Dumbbell,
    color: 'text-teal-500',
    gradient: 'from-teal-500/20 to-cyan-500/20',
  },
  nutrition: {
    icon: Apple,
    color: 'text-lime-500',
    gradient: 'from-lime-500/20 to-emerald-500/20',
  },
  mentalhealth: {
    icon: Brain,
    color: 'text-violet-500',
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  wellness: {
    icon: Leaf,
    color: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-green-500/20',
  },

  // Образ жизни
  lifestyle: {
    icon: Sparkles,
    color: 'text-amber-500',
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  mindfulness: {
    icon: Moon,
    color: 'text-indigo-500',
    gradient: 'from-indigo-500/20 to-blue-500/20',
  },
  meditation: {
    icon: Sun,
    color: 'text-yellow-500',
    gradient: 'from-yellow-500/20 to-amber-500/20',
  },
  yoga: {
    icon: Activity,
    color: 'text-purple-500',
    gradient: 'from-purple-500/20 to-violet-500/20',
  },

  // Мотивация
  motivation: {
    icon: Flame,
    color: 'text-orange-500',
    gradient: 'from-orange-500/20 to-red-500/20',
  },
  inspiration: {
    icon: Star,
    color: 'text-yellow-500',
    gradient: 'from-yellow-500/20 to-amber-500/20',
  },
  success: {
    icon: Trophy,
    color: 'text-amber-500',
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
  goals: {
    icon: Target,
    color: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-teal-500/20',
  },

  // Еда и напитки
  food: {
    icon: Coffee,
    color: 'text-amber-500',
    gradient: 'from-amber-500/20 to-orange-500/20',
  },
  cooking: {
    icon: Flame,
    color: 'text-red-500',
    gradient: 'from-red-500/20 to-orange-500/20',
  },
  recipes: {
    icon: Gift,
    color: 'text-pink-500',
    gradient: 'from-pink-500/20 to-rose-500/20',
  },

  // Природа
  nature: {
    icon: Leaf,
    color: 'text-green-500',
    gradient: 'from-green-500/20 to-emerald-500/20',
  },
  outdoors: {
    icon: Compass,
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  travel: {
    icon: Globe,
    color: 'text-cyan-500',
    gradient: 'from-cyan-500/20 to-blue-500/20',
  },

  // Наука и знания
  science: {
    icon: Brain,
    color: 'text-purple-500',
    gradient: 'from-purple-500/20 to-indigo-500/20',
  },
  research: {
    icon: Wrench,
    color: 'text-gray-500',
    gradient: 'from-gray-500/20 to-gray-600/20',
  },
  education: {
    icon: Book,
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-indigo-500/20',
  },

  // Технологии
  technology: {
    icon: Wifi,
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  digital: {
    icon: Lock,
    color: 'text-indigo-500',
    gradient: 'from-indigo-500/20 to-purple-500/20',
  },

  // Сообщество
  community: {
    icon: Users,
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  family: {
    icon: User,
    color: 'text-pink-500',
    gradient: 'from-pink-500/20 to-rose-500/20',
  },
  relationships: {
    icon: Heart,
    color: 'text-rose-500',
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  vitamins: {
    icon: PillBottle, // Иконка для витаминов/добавок [citation:7]
    color: 'text-orange-500',
    gradient: 'from-orange-500/20 to-amber-500/20',
  },
  homeworkouts: {
    icon: Dumbbell, // Иконка для тренировок дома [citation:9]
    color: 'text-teal-500',
    gradient: 'from-teal-500/20 to-cyan-500/20',
  },
  cardio: {
    icon: HeartPulse, // Иконка для кардио-нагрузок
    color: 'text-rose-500',
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  immunity: {
    icon: Shield, // Иконка для иммунитета [citation:8]
    color: 'text-blue-500',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  weightloss: {
    icon: Scale, // Иконка для похудения
    color: 'text-emerald-500',
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
};

// Иконка по умолчанию
export const defaultTagIcon = {
  icon: Hash,
  color: 'text-blue-500',
  gradient: 'from-blue-500/20 to-indigo-500/20',
};

// Константы для пагинации
export const ARTICLES_PER_PAGE = 3;

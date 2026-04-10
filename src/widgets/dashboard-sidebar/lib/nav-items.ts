import {
  ChartColumnStacked,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Tags,
  Users,
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/dashboard/articles',
    label: 'Articles',
    icon: FileText,
    exact: false,
  },
  {
    href: '/dashboard/users',
    label: 'Users',
    icon: Users,
    exact: false,
  },
  {
    href: '/dashboard/comments',
    label: 'Comments',
    icon: MessageCircle,
    exact: false,
  },

  {
    href: '/dashboard/tags',
    label: 'Tags',
    icon: Tags,
    exact: false,
  },
  {
    href: '/dashboard/categories',
    label: 'Categories',
    icon: ChartColumnStacked,
    exact: false,
  },
] as const;

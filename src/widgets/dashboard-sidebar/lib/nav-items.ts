import {
  BarChart,
  FileText,
  LayoutDashboard,
  MessageCircle,
  Settings,
} from 'lucide-react';

export const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Overview',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: '/dashboard/posts',
    label: 'Articles',
    icon: FileText,
    exact: false,
  },
  {
    href: '/dashboard/comments',
    label: 'Comments',
    icon: MessageCircle,
    exact: false,
  },
  {
    href: '/dashboard/analytics',
    label: 'Analytics',
    icon: BarChart,
    exact: false,
  },
  {
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
    exact: false,
  },
] as const;

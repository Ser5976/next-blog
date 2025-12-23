import {
  FileText,
  LayoutDashboard,
  MessageCircle,
  Settings,
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
    href: '/dashboard/posts',
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
    href: '/dashboard/settings',
    label: 'Settings',
    icon: Settings,
    exact: false,
  },
] as const;

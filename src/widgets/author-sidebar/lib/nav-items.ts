import { ChartNoAxesColumn, FileText, MessageCircle } from 'lucide-react';

export const AUTHOR_NAV_ITEMS = [
  {
    href: '/author',
    label: 'Overview',
    icon: ChartNoAxesColumn,
    exact: true,
  },
  {
    href: '/author/articles',
    label: 'Articles',
    icon: FileText,
    exact: false,
  },
  {
    href: '/author/comments',
    label: 'Comments',
    icon: MessageCircle,
    exact: false,
  },
] as const;

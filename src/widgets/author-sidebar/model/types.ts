import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export type AuthorSidebarProps = {
  closeSheet?: () => void;
};

export type AuthorNavButtonProps = {
  href: string;
  icon: LucideIcon;
  children: ReactNode;
  closeSheet?: () => void;
  exact?: boolean;
};

import { PenTool, Shield, UserIcon } from 'lucide-react';

export const ROLE_DISPLAY_NAMES = {
  admin: 'Administrator',
  author: 'Author',
  user: 'User',
} as const;

export const ROLE_ICONS = {
  admin: Shield,
  author: PenTool,
  user: UserIcon,
} as const;

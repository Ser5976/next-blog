import { PenTool, Shield, User } from 'lucide-react';

import { User as UserFullName } from '../model';

export const getFullName = (user: UserFullName) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) return user.firstName;
  if (user.lastName) return user.lastName;
  return user.email.split('@')[0];
};

export const getRoleInfo = (role: string) => {
  switch (role) {
    case 'admin':
      return {
        icon: Shield,
        color: 'bg-red-100 text-red-800 border-red-200',
        label: 'Administrator',
      };
    case 'author':
      return {
        icon: PenTool,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Author',
      };
    default:
      return {
        icon: User,
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        label: 'User',
      };
  }
};

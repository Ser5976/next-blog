import { PenTool, Shield, User } from 'lucide-react';

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

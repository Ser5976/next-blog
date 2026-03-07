import { UserClerk } from '../types';

export const getFullName = (user: UserClerk) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) return user.firstName;
  if (user.lastName) return user.lastName;
  // Добавляем проверку на наличие email
  if (!user.email) return 'User';
  return user.email.split('@')[0];
};

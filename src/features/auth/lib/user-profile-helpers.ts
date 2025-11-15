import { ClerkUser } from '../model';

// Получает отображаемое имя пользователя из данных Clerk
export function getDisplayName(user: ClerkUser | null | undefined): string {
  if (!user) {
    return 'User';
  }

  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  if (user.username) {
    return user.username;
  }
  return 'User';
}

// Получает email пользователя из данных Clerk

export function getEmail(user: ClerkUser | null | undefined): string {
  if (!user) {
    return 'No email';
  }
  return user.primaryEmailAddress?.emailAddress || 'No email';
}

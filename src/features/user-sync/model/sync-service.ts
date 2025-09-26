import { UserService, type CreateUserInput } from '@/entities/user';
import { type ClerkUser } from '@/shared/api/clerk';

export class UserSyncService {
  // Синхронизация пользователя при регистрации (Custom Onboarding)
  static async syncUserOnRegistration(clerkUser: ClerkUser): Promise<void> {
    try {
      // Проверяем, не существует ли уже пользователь
      const existingUser = await UserService.getUserByClerkId(clerkUser.id);

      if (existingUser) {
        console.log('User already exists:', clerkUser.id);
        return;
      }

      // Создаем пользователя в нашей БД
      const userData: CreateUserInput = {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        imageUrl: clerkUser.imageUrl,
        role:
          (clerkUser.publicMetadata?.role as 'USER' | 'AUTHOR' | 'ADMIN') ||
          'USER',
      };

      await UserService.createUser(userData);
      console.log('User synced successfully:', clerkUser.id);
    } catch (error) {
      console.error('Error syncing user on registration:', error);
      throw error;
    }
  }
}

import { prisma } from '@/shared/api/prisma';
import type { CreateUserInput, User } from '../model';

export class SyncUserService {
  // Создание пользователя(для базы данных)
  static async createUser(data: CreateUserInput): Promise<User> {
    try {
      const existingUserByClerkId = await prisma.user.findUnique({
        where: {
          clerkId: data.clerkId,
        },
      });

      if (existingUserByClerkId) {
        return existingUserByClerkId;
      }

      const user = await prisma.user.create({
        data: {
          clerkId: data.clerkId,
        },
      });

      return user;
    } catch (error) {
      console.log('user-create-error:', error);
      throw new Error('sync_failed');
    }
  }

  // Удаление пользователя (для webhook'ов)
  static async deleteUser(clerkId: string): Promise<void> {
    try {
      const deletedUser = await prisma.user.delete({
        where: { clerkId },
      });
      console.log(`✅ User deleted from database: ${deletedUser.id}`);
    } catch (error) {
      // Если запись не найдена — выбросим P2025, которая отловится выше
      console.error(`❌ Failed to delete user with clerkId=${clerkId}:`, error);
      throw error;
    }
  }
}

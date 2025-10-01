import { prisma } from '@/shared/api/prisma';
import type { CreateUserInput, UpdateUserInput, User } from '../model';

export class SyncUserService {
  // Создание пользователя(для базы данных)
  static async createUser(data: CreateUserInput): Promise<User> {
    try {
      const existingUserByEmail = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });

      if (existingUserByEmail) {
        throw new Error('email_exists');
      }

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
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          imageUrl: data.imageUrl,
          role: data.role || 'USER',
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Error && error.message === 'email_exists') {
        throw error;
      } else {
        throw new Error('sync_failed');
      }
    }
  }

  // Обновление пользователя (для webhook'ов)
  static async updateUser(
    clerkId: string,
    data: UpdateUserInput
  ): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { clerkId },
        data: {
          ...data,
        },
      });

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }
  // Удаление пользователя (для webhook'ов)
  static async deleteUser(clerkId: string): Promise<void> {
    try {
      await prisma.user.delete({
        where: { clerkId },
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }
}

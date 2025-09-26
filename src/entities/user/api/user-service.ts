import { prisma } from '@/shared/api/prisma';
import type { CreateUserInput, UpdateUserInput, User } from '../model/types';

export class UserService {
  // Создание пользователя (для Custom Onboarding)
  static async createUser(data: CreateUserInput): Promise<User> {
    try {
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
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  // Получение пользователя по clerkId
  static async getUserByClerkId(clerkId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId },
      });

      return user;
    } catch (error) {
      console.error('Error getting user by clerkId:', error);
      throw new Error('Failed to get user');
    }
  }

  // Проверка существования пользователя
  static async userExists(clerkId: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true },
      });

      return !!user;
    } catch (error) {
      console.error('Error checking user existence:', error);
      return false;
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

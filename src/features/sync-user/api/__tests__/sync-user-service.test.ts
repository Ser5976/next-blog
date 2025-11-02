import { prisma } from '@/shared/api/prisma';
import type { CreateUserInput, User } from '../../model';
import { SyncUserService } from '../sync-user-service';

// Мокируем Prisma
jest.mock('@/shared/api/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

// Получаем моки из замоканного модуля
const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockFindUnique = mockPrisma.user.findUnique as jest.MockedFunction<
  typeof mockPrisma.user.findUnique
>;
const mockCreate = mockPrisma.user.create as jest.MockedFunction<
  typeof mockPrisma.user.create
>;
const mockDeleteMany = mockPrisma.user.deleteMany as jest.MockedFunction<
  typeof mockPrisma.user.deleteMany
>;

describe('SyncUserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Мокируем console.log чтобы не засорять вывод тестов
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createUser', () => {
    const mockUserData: CreateUserInput = {
      clerkId: 'clerk_123',
    };

    const mockUser: User = {
      id: 'user_123',
      clerkId: 'clerk_123',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should create a new user when user does not exist', async () => {
      // Arrange
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue(mockUser);

      // Act
      const result = await SyncUserService.createUser(mockUserData);

      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { clerkId: 'clerk_123' },
      });
      expect(mockCreate).toHaveBeenCalledWith({
        data: { clerkId: 'clerk_123' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return existing user when user already exists by clerkId', async () => {
      // Arrange
      mockFindUnique.mockResolvedValue(mockUser);

      // Act
      const result = await SyncUserService.createUser(mockUserData);

      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { clerkId: 'clerk_123' },
      });
      expect(mockCreate).not.toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw sync_failed error when database operation fails', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockFindUnique.mockRejectedValue(dbError);

      // Act & Assert
      await expect(SyncUserService.createUser(mockUserData)).rejects.toThrow(
        'sync_failed'
      );
      expect(console.log).toHaveBeenCalledWith('user-create-error:', dbError);
    });

    it('should throw sync_failed error when user creation fails', async () => {
      // Arrange
      mockFindUnique.mockResolvedValue(null);
      const createError = new Error('Unique constraint violation');
      mockCreate.mockRejectedValue(createError);

      // Act & Assert
      await expect(SyncUserService.createUser(mockUserData)).rejects.toThrow(
        'sync_failed'
      );
      expect(console.log).toHaveBeenCalledWith(
        'user-create-error:',
        createError
      );
    });
  });

  describe('deleteUser', () => {
    const clerkId = 'clerk_123';

    it('should delete user successfully', async () => {
      // Arrange
      mockDeleteMany.mockResolvedValue({ count: 1 });

      // Act
      await SyncUserService.deleteUser(clerkId);

      // Assert
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { clerkId },
      });
      expect(console.log).toHaveBeenCalledWith('✅ User deleted from database');
    });

    it('should handle deletion when user does not exist', async () => {
      // Arrange
      mockDeleteMany.mockResolvedValue({ count: 0 });

      // Act
      await SyncUserService.deleteUser(clerkId);

      // Assert
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { clerkId },
      });
      expect(console.log).toHaveBeenCalledWith('✅ User deleted from database');
    });

    it('should throw error when database operation fails', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockDeleteMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(SyncUserService.deleteUser(clerkId)).rejects.toThrow(
        dbError
      );
      expect(console.error).toHaveBeenCalledWith(
        `❌ Failed to delete user with clerkId=${clerkId}:`,
        dbError
      );
    });

    it('should handle Prisma P2025 error (record not found)', async () => {
      // Arrange
      const prismaError = new Error('Record to delete does not exist');
      prismaError.name = 'P2025';
      mockDeleteMany.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(SyncUserService.deleteUser(clerkId)).rejects.toThrow(
        prismaError
      );
      expect(console.error).toHaveBeenCalledWith(
        `❌ Failed to delete user with clerkId=${clerkId}:`,
        prismaError
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty clerkId in createUser', async () => {
      // Arrange
      const emptyUserData: CreateUserInput = { clerkId: '' };
      mockFindUnique.mockResolvedValue(null);
      mockCreate.mockResolvedValue({
        id: 'user_123',
        clerkId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await SyncUserService.createUser(emptyUserData);

      // Assert
      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { clerkId: '' },
      });
      expect(result.clerkId).toBe('');
    });

    it('should handle empty clerkId in deleteUser', async () => {
      // Arrange
      mockDeleteMany.mockResolvedValue({ count: 0 });

      // Act
      await SyncUserService.deleteUser('');

      // Assert
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { clerkId: '' },
      });
    });
  });
});

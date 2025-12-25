import { z } from 'zod';

export const usersFiltersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  emailSearch: z.string().optional(),
});

export const updateRoleSchema = z.object({
  userId: z.string().min(1),
  newRole: z.enum(['user', 'author', 'admin']),
});

export const deleteUserSchema = z.object({
  userId: z.string().min(1),
});

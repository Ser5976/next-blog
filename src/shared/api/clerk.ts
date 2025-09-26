import { clerkClient } from '@clerk/nextjs/server';

export const clerk = clerkClient;

// Типы для работы с Clerk
export interface ClerkUser {
  id: string;
  emailAddresses: Array<{
    emailAddress: string;
  }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
  publicMetadata?: Record<string, unknown>;
}

export interface CreateUserData {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  role?: 'USER' | 'AUTHOR' | 'ADMIN';
}

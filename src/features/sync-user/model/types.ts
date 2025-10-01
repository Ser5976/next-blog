export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  role: 'USER' | 'AUTHOR' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  role?: 'USER' | 'AUTHOR' | 'ADMIN';
}

export interface UpdateUserInput {
  email?: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  role?: 'USER' | 'AUTHOR' | 'ADMIN';
}

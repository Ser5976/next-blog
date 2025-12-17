export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  imageUrl: string;
  createdAt: number;
  lastSignInAt: number | null;
}

export interface UsersFilters {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'lastSignInAt' | 'email';
  sortOrder?: 'asc' | 'desc';
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  total: number;
  page: number;
  totalPages: number;
  message?: string;
}

export interface DeleteUserParams {
  userId: string;
}

export interface UpdateRoleParams {
  userId: string;
  newRole: string;
}

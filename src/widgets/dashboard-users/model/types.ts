// widgets/dashboard2/user-management/model/types.ts
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
  page?: number;
  limit?: number;
  emailSearch?: string; // Только поиск по email (тот, что Clerk поддерживает)
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

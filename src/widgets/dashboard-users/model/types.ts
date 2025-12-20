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
  emailSearch?: string;
}

export interface UsersResponse {
  success: boolean;
  users: User[];
  total: number;
  page: number;
  totalPages: number;
  message?: string;
}

export interface UpdateRoleParams {
  userId: string;
  newRole: string;
}

export interface DeleteUserParams {
  userId: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

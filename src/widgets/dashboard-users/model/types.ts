import { User } from '@/features/user-profile-info';

export interface UsersFilters {
  page: number;
  limit: number;
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

export interface ApiResponse {
  message: string;
  success: boolean;
}

export interface UserRowProps {
  user: User;
  onRoleChange: (userId: string, newRole: string) => void;
  onDelete: (userId: string, userEmail: string) => void;
  isUpdatingRole?: boolean;
  isDeleting?: boolean;
}

export interface UsersFiltersProps {
  filters: UsersFilters;
  onFiltersChange: (filters: UsersFilters) => void;
}

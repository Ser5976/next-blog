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

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}

export interface UsersErrorProps {
  error?: Error | null;
  onRetry?: () => void;
}

export interface UsersEmptyProps {
  searchQuery?: string;
}

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface UserRowProps {
  user: User;
  onRoleChange: (userId: string, newRole: string) => void;
  onDelete: (userId: string, userEmail: string) => void;
  isUpdatingRole?: boolean;
  isDeleting?: boolean;
}

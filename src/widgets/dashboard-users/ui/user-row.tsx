'use client';

import Image from 'next/image';
import {
  Calendar,
  Loader2,
  LogIn,
  Mail,
  MoreVertical,
  PenTool,
  Shield,
  User,
} from 'lucide-react';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { User as UserType } from '../model';

interface UserRowProps {
  user: UserType;
  onRoleChange: (userId: string, newRole: string) => void;
  onDelete: (userId: string, userEmail: string) => void;
  isUpdatingRole?: boolean;
  isDeleting?: boolean;
}

export function UserRow({
  user,
  onRoleChange,
  onDelete,
  isUpdatingRole = false,
  isDeleting = false,
}: UserRowProps) {
  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'author':
        return 'default';
      case 'user':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'author':
        return 'Author';
      case 'user':
        return 'User';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'author':
        return <PenTool className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Never';

    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) return 'Invalid date';

      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();

      return `${month} ${day}, ${year}`;
    } catch (error) {
      if (error instanceof Error) return error.message;
      return 'Error';
    }
  };

  const handleRoleChange = (newRole: string) => {
    if (newRole === user.role || isUpdatingRole || isDeleting) return;
    onRoleChange(user.id, newRole);
  };

  const handleDelete = () => {
    if (isUpdatingRole || isDeleting) return;
    onDelete(user.id, user.email);
  };

  const getFullName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.email.split('@')[0];
  };

  const isDisabled = isUpdatingRole || isDeleting;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group">
      {/* Левая часть: информация о пользователе */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {/* Аватар */}
        <div className="relative">
          {user.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={getFullName()}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full border object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-muted to-muted/70 border flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-muted-foreground" />
            </div>
          )}

          {/* Индикатор активности */}
          {user.lastSignInAt && (
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
          )}
        </div>

        {/* Информация */}
        <div className="flex-1 min-w-0">
          {/* Имя и роль */}
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium truncate text-foreground">
              {getFullName()}
            </h4>
            <Badge
              variant={getRoleVariant(user.role)}
              className="text-xs flex items-center gap-1 px-2 py-0.5"
            >
              {getRoleIcon(user.role)}
              <span className="capitalize">{user.role}</span>
            </Badge>
          </div>

          {/* Детали */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {/* Email */}
            <span
              className="flex items-center gap-1 truncate max-w-[200px]"
              title={user.email}
            >
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </span>

            {/* Дата регистрации */}
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              {formatDate(user.createdAt)}
            </span>

            {/* Последний вход */}
            {user.lastSignInAt && (
              <span className="flex items-center gap-1 whitespace-nowrap">
                <LogIn className="h-3 w-3 flex-shrink-0" />
                {formatDate(user.lastSignInAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Правая часть: управление */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Выбор роли */}
        <div className="relative">
          <Select
            value={user.role}
            onValueChange={handleRoleChange}
            disabled={isDisabled}
          >
            <SelectTrigger
              className={`w-32 ${isUpdatingRole ? 'opacity-50' : ''}`}
              aria-label="Change user role"
            >
              {isUpdatingRole ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-sm">Updating...</span>
                </div>
              ) : (
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span>{getRoleDisplayName(user.role)}</span>
                  </div>
                </SelectValue>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>User</span>
                </div>
              </SelectItem>
              <SelectItem value="author">
                <div className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  <span>Author</span>
                </div>
              </SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Administrator</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Меню действий */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={isDisabled}
              className="h-9 w-9"
              aria-label="User actions"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDisabled}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <span className="flex items-center gap-2">
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete User'
                )}
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

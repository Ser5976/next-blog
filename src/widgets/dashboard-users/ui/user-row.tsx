'use client';

import { memo, useCallback } from 'react';
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
  UserIcon,
} from 'lucide-react';

import { formatDate } from '@/shared/lib';
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
import { UserRowProps } from '../model';
import { ROLE_DISPLAY_NAMES, ROLE_ICONS } from '../model/constants';

const UserRowComponent = ({
  user,
  onRoleChange,
  onDelete,
  isUpdatingRole = false,
  isDeleting = false,
}: UserRowProps) => {
  const getRoleDisplayName = useCallback((role: string): string => {
    return ROLE_DISPLAY_NAMES[role as keyof typeof ROLE_DISPLAY_NAMES] || role;
  }, []);
  const getRoleIcon = useCallback((role: string) => {
    const IconComponent =
      ROLE_ICONS[role as keyof typeof ROLE_ICONS] || UserIcon;
    return <IconComponent className="h-3 w-3" aria-hidden="true" />;
  }, []);

  const handleRoleChange = useCallback(
    (newRole: string) => {
      if (newRole === user.role || isUpdatingRole || isDeleting) return;
      onRoleChange(user.id, newRole);
    },
    [user.id, user.role, isUpdatingRole, isDeleting, onRoleChange]
  );

  const handleDelete = useCallback(() => {
    if (isUpdatingRole || isDeleting) return;
    onDelete(user.id, user.email);
  }, [user.id, user.email, isUpdatingRole, isDeleting, onDelete]);

  function getFullName() {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.email.split('@')[0];
  }

  const isDisabled = isUpdatingRole || isDeleting;
  const ariaBusy = isUpdatingRole || isDeleting;
  const ariaLabel = `${getFullName()}, ${user.email}, role: ${user.role}`;

  return (
    <div
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
      role="row"
      aria-label={ariaLabel}
      aria-busy={ariaBusy}
      data-testid={`user-row-${user.id}`}
    >
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
              aria-hidden="true"
              data-testid="user-avatar"
            />
          ) : (
            <div
              className="h-12 w-12 rounded-full bg-gradient-to-br from-muted to-muted/70 border flex items-center justify-center flex-shrink-0"
              data-testid="user-avatar-placeholder"
            >
              <User
                className="h-6 w-6 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Информация */}
        <div className="flex-1 min-w-0">
          {/* Имя и роль */}
          <div className="flex items-center gap-2 mb-1">
            <h4
              className="font-medium truncate text-foreground"
              data-testid="user-fullname"
            >
              {getFullName()}
            </h4>
          </div>

          {/* Детали */}
          <div
            className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground"
            role="list"
            aria-label="User details"
          >
            {/* Email */}
            <span
              className="flex items-center gap-1 truncate max-w-[200px]"
              title={user.email}
              role="listitem"
              data-testid="user-email"
            >
              <Mail className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{user.email}</span>
            </span>

            {/* Дата регистрации */}
            <span
              className="flex items-center gap-1 whitespace-nowrap"
              role="listitem"
              data-testid="user-created-at"
            >
              <Calendar className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              {formatDate(user.createdAt)}
            </span>

            {/* Последний вход */}
            {user.lastSignInAt && (
              <span
                className="flex items-center gap-1 whitespace-nowrap"
                role="listitem"
                data-testid="user-last-signin"
              >
                <LogIn className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
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
            data-testid="role-select"
          >
            <SelectTrigger
              className={` cursor-pointer w-32 ${isUpdatingRole ? 'opacity-50' : ''}`}
              aria-label={`Change role for ${getFullName()}`}
              aria-busy={isUpdatingRole}
              data-testid="role-select-trigger"
            >
              {isUpdatingRole ? (
                <div className="flex items-center gap-2">
                  <Loader2
                    className="h-3 w-3 animate-spin"
                    aria-hidden="true"
                  />
                  <span className="text-sm">Updating...</span>
                </div>
              ) : (
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span data-testid="current-role">
                      {getRoleDisplayName(user.role)}
                    </span>
                  </div>
                </SelectValue>
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user" data-testid="role-option-user">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span>User</span>
                </div>
              </SelectItem>
              <SelectItem value="author" data-testid="role-option-author">
                <div className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" aria-hidden="true" />
                  <span>Author</span>
                </div>
              </SelectItem>
              <SelectItem value="admin" data-testid="role-option-admin">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" aria-hidden="true" />
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
              className="h-9 w-9 cursor-pointer"
              aria-label={`Actions for ${getFullName()}`}
              aria-haspopup="true"
              aria-expanded="false"
              data-testid="user-actions-button"
            >
              {isDeleting ? (
                <Loader2
                  className="h-4 w-4 animate-spin text-muted-foreground"
                  aria-label="Deleting user..."
                />
              ) : (
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48"
            data-testid="user-actions-menu"
          >
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDisabled}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              data-testid="delete-user-button"
            >
              <span className="flex items-center gap-2">
                {isDeleting ? (
                  <>
                    <Loader2
                      className="h-3 w-3 animate-spin"
                      aria-hidden="true"
                    />
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
};

export const UserRow = memo(UserRowComponent);
UserRow.displayName = 'UserRow';

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, LogIn, Mail, MoreVertical, User } from 'lucide-react';

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
import { formatDate } from '../lib';
import { User as UserType } from '../model/types';

interface UserRowProps {
  user: UserType;
  onRoleChange: (userId: string, newRole: string) => Promise<void>;
  onDelete: (userId: string, userEmail: string) => Promise<void>;
  currentUserId?: string;
}

export function UserRow({
  user,
  onRoleChange,
  onDelete,
  currentUserId,
}: UserRowProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleRoleChange = async (newRole: string) => {
    if (newRole === user.role) return;

    setIsUpdating(true);
    try {
      await onRoleChange(user.id, newRole);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete user ${user.email}?`)) return;

    setIsDeleting(true);
    try {
      await onDelete(user.id, user.email);
    } finally {
      setIsDeleting(false);
    }
  };

  const isCurrentUser = currentUserId === user.id;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors group">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.firstName || user.email}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full border object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-muted border flex items-center justify-center flex-shrink-0">
            <User className="h-6 w-6 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium truncate">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </h4>
            {isCurrentUser && (
              <Badge variant="outline" className="text-xs">
                You
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined: {formatDate(user.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <LogIn className="h-3 w-3" />
              Last active: {formatDate(user.lastSignInAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <Select
          defaultValue={user.role}
          onValueChange={handleRoleChange}
          disabled={isUpdating || isDeleting || isCurrentUser}
        >
          <SelectTrigger className="w-32">
            <SelectValue>
              {isUpdating ? 'Updating...' : getRoleDisplayName(user.role)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isDeleting}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isCurrentUser || isDeleting}
              className="text-red-600 focus:text-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

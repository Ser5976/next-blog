'use client';

import { Loader2 } from 'lucide-react';

import { User } from '../model';
import { UserRow } from './user-row';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onRoleChange: (userId: string, newRole: string) => void;
  onDelete: (userId: string, userEmail: string) => void;
}

export function UsersTable({
  users,
  isLoading,
  onRoleChange,
  onDelete,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-gradient-to-r from-muted/50 to-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <div className="h-12 w-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
          <Loader2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No users found</h3>
        <p className="text-muted-foreground text-sm">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          onRoleChange={onRoleChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

import { AuthButton } from '@/features/auth';
import { getDisplayName, getEmail } from '../lib';

export function UserProfile() {
  const { isLoaded, user } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  // Гарантируем, что клиентский рендеринг происходит только после монтирования
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isLoaded) {
    return (
      <div
        className="p-4 border-t"
        role="status"
        aria-label="Loading user profile"
        data-testid="user-profile-loading"
      >
        <div className="flex items-center gap-3 px-2 py-2 text-sm">
          <div
            className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0 space-y-1">
            <div
              className="h-4 bg-gray-200 rounded animate-pulse"
              aria-hidden="true"
            />
            <div
              className="h-3 bg-gray-200 rounded animate-pulse w-2/3"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 border-t"
      role="region"
      aria-label="User profile"
      data-testid="user-profile"
    >
      <div className="flex items-center gap-3 px-2 py-2 text-sm">
        <AuthButton />
        <div className="flex-1 min-w-0">
          <p
            className="font-medium truncate text-foreground"
            data-testid="user-display-name"
            aria-label="User display name"
          >
            {getDisplayName(user)}
          </p>
          <p
            className="text-muted-foreground truncate"
            data-testid="user-email"
            aria-label="User email"
          >
            {getEmail(user)}
          </p>
        </div>
      </div>
    </div>
  );
}

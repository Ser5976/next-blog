'use client';

import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function ClientUserButton() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Placeholder while component is not mounted on client
    return (
      <div
        className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"
        role="status"
        aria-label="Loading user menu"
        aria-live="polite"
      />
    );
  }

  return (
    <div role="navigation" aria-label="User account menu">
      <UserButton />
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function ClientUserButton() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      role="navigation"
      className="flex items-center justify-center"
      aria-label="User account menu"
    >
      <UserButton />
    </div>
  );
}

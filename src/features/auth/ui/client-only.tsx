'use client';

import { useEffect, useState } from 'react';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const ClientOnly = ({ children, fallback = null }: ClientOnlyProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div role="status" aria-live="polite" aria-label="Content is loading">
        {fallback}
      </div>
    );
  }

  return (
    <div aria-live="polite" aria-label="Content has loaded">
      {children}
    </div>
  );
};

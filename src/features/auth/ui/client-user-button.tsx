'use client';

import { useEffect, useState } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function ClientUserButton() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Заглушка пока компонент не смонтирован на клиенте
    return <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />;
  }

  return <UserButton />;
}

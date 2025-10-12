'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export const useClientSearchParams = () => {
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setIsReady(true);
    setParams(searchParams);
  }, [searchParams]);

  return {
    isReady,
    searchParams: params,
    get: (key: string) => params?.get(key),
  };
};

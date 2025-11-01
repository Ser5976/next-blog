'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export const useClientSearchParams = () => {
  const searchParams = useSearchParams();
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    setParams(searchParams);
  }, [searchParams]);

  return {
    searchParams: params,
    get: (key: string) => params?.get(key),
  };
};

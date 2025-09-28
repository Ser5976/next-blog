'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useWelcomeBanner(autoHideDuration?: number) {
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const showWelcome = searchParams.get('welcome');

    if (showWelcome) {
      setIsVisible(true);

      if (autoHideDuration) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          cleanUrlParam();
        }, autoHideDuration);

        return () => clearTimeout(timer);
      }
    }
  }, [searchParams, pathname, autoHideDuration]);

  const cleanUrlParam = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('welcome');
    window.history.replaceState({}, '', url.toString());
  };

  const closeBanner = () => {
    setIsVisible(false);
    cleanUrlParam();
  };

  return {
    isVisible,
    closeBanner,
  };
}

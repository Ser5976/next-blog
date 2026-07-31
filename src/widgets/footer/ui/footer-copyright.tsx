'use client';

import { useEffect, useState } from 'react';

export const FooterCopyright = () => {
  const [currentYear, setCurrentYear] = useState<number>(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <div
      className="border-t border-border mt-6 py-4 text-center text-xs text-muted-foreground"
      aria-label="Copyright information"
    >
      © {currentYear} Createx Blog. All rights reserved.
    </div>
  );
};

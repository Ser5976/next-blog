'use client';

import { ThemeProvider } from '@/features/theme-toggle';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={true}
      storageKey="my-app-theme"
    >
      {children}
    </ThemeProvider>
  );
};

export default Providers;

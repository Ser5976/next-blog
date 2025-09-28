'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/features/theme-toggle';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange={true}
        storageKey="my-app-theme"
      >
        <Toaster />
        {children}
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default Providers;

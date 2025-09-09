export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export interface UseThemeInitOptions {
  defaultTheme: Theme;
  storageKey: string;
  attribute: string;
  enableSystem: boolean;
  disableTransitionOnChange: boolean;
}

import { cn } from '@/shared/lib';
import { SearchProps } from '../model';

export const SearchFormFallback = ({ variant = 'desktop' }: SearchProps) => (
  <div
    className={cn(
      'rounded-full',
      variant === 'desktop' &&
        'hidden h-9 w-56 border border-border/40 bg-muted/40 md:block dark:border-white/10 dark:bg-white/5',
      variant === 'mobile' &&
        'h-10 w-full border border-border/40 bg-muted/40 dark:border-white/10 dark:bg-white/5',
      variant === 'page' &&
        'h-12 w-full border border-border/40 bg-muted/40 sm:h-14 dark:border-white/10 dark:bg-white/5',
      variant === 'cta' &&
        'h-12 w-full max-w-md border border-white/30 bg-white/15 sm:h-14'
    )}
    aria-hidden="true"
  />
);

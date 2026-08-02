'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button, Input } from '@/shared/ui';

interface Props {
  variant?: 'desktop' | 'mobile' | 'page' | 'cta';
  onClose?: () => void;
}

const SearchFormInner = ({ variant = 'desktop', onClose }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('query') ?? '';
  const [value, setValue] = useState(urlQuery);

  useEffect(() => {
    setValue(urlQuery);
  }, [urlQuery]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onClose?.();
    router.push(`/search?query=${encodeURIComponent(trimmed)}&page=1`);
  };

  const handleClear = () => {
    setValue('');
    if (urlQuery) {
      router.push('/search');
    }
  };

  const isPage = variant === 'page';
  const isMobile = variant === 'mobile';
  const isCta = variant === 'cta';
  const isDesktop = variant === 'desktop';

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'group flex items-center gap-1 rounded-full transition-all',
        // Default surfaces (header / mobile / search page)
        !isCta && [
          'border border-border/40 bg-muted/40 backdrop-blur-sm',
          'focus-within:border-emerald-500/40 focus-within:bg-background',
          'focus-within:ring-2 focus-within:ring-emerald-500/15',
          'dark:border-white/10 dark:bg-white/5 dark:shadow-none',
          'dark:focus-within:border-emerald-400/30 dark:focus-within:bg-white/10',
        ],
        // CTA banner — glass on emerald
        isCta && [
          'h-12 w-full max-w-md border border-white/30 bg-white/15 shadow-sm backdrop-blur-md sm:h-14',
          'focus-within:border-white/50 focus-within:bg-white/25',
          'focus-within:ring-2 focus-within:ring-white/25',
        ],
        isDesktop && 'hidden px-1.5 py-0.5 md:flex',
        isMobile && 'flex w-full px-1.5 py-0.5',
        isPage && 'flex w-full px-2 py-1.5 sm:px-3 sm:py-2',
        isCta && 'flex px-2 sm:px-3'
      )}
      role="search"
      aria-label="Site search"
    >
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className={cn(
          'shrink-0 rounded-full cursor-pointer',
          !isCta && [
            'text-muted-foreground',
            'hover:bg-emerald-500/10 hover:text-emerald-600',
            'dark:hover:bg-white/10 dark:hover:text-emerald-400',
          ],
          isCta && 'h-9 w-9 text-white/80 hover:bg-white/15 hover:text-white sm:h-10 sm:w-10',
          isMobile && 'h-10 w-10',
          isPage && 'h-10 w-10 sm:h-11 sm:w-11'
        )}
        aria-label="Submit search"
      >
        <Search
          className={cn(
            isDesktop && 'h-4 w-4',
            (isMobile || isCta || isPage) && 'h-5 w-5'
          )}
          aria-hidden="true"
        />
      </Button>

      <Input
        name="query"
        value={value}
        required
        type="text"
        placeholder={
          isPage || isCta
            ? 'Search articles by title or content...'
            : 'Search...'
        }
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          'border-0 bg-transparent shadow-none dark:bg-transparent',
          'focus-visible:border-0 focus-visible:ring-0',
          // Prevent inheriting parent colors (e.g. CTA text-white)
          !isCta &&
            'text-foreground caret-foreground placeholder:text-muted-foreground/70',
          isCta &&
            'text-white caret-white placeholder:text-white/60 selection:bg-white/30 selection:text-white',
          isDesktop && 'h-8 w-44 lg:w-52',
          isMobile && 'h-9 w-full',
          isPage && 'h-10 w-full text-base sm:h-11 sm:text-base',
          isCta && 'h-9 w-full text-base sm:h-10'
        )}
        aria-label="Search query"
        aria-required="true"
        aria-describedby="search-instructions"
        autoComplete="off"
      />

      {value ? (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleClear}
          className={cn(
            'shrink-0 rounded-full cursor-pointer',
            !isCta &&
              'text-muted-foreground hover:bg-muted dark:hover:bg-white/10',
            isCta && 'text-white/70 hover:bg-white/15 hover:text-white',
            isCta && 'h-9 w-9 sm:h-10 sm:w-10',
            isPage && 'h-10 w-10 sm:h-11 sm:w-11',
            !isPage && !isCta && 'h-8 w-8'
          )}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      ) : null}

      <span id="search-instructions" className="sr-only">
        Enter your search terms and press enter to search blog posts
      </span>
    </form>
  );
};

const SearchFormFallback = ({ variant = 'desktop' }: Props) => (
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

export const SearchForm = (props: Props) => (
  <Suspense fallback={<SearchFormFallback variant={props.variant} />}>
    <SearchFormInner {...props} />
  </Suspense>
);

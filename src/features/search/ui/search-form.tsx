'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import { cn } from '@/shared/lib';
import { Button, Input } from '@/shared/ui';

interface Props {
  variant?: 'desktop' | 'mobile';
  onClose?: () => void;
}

export const SearchForm = ({ variant = 'desktop', onClose }: Props) => {
  const [value, setValue] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onClose?.();
    router.push(`/search?query=${encodeURIComponent(trimmed)}`);
    setValue('');
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex items-center bg-muted/20 dark:bg-muted/10 rounded-full',
        variant === 'desktop' && 'hidden md:flex px-2 py-1',
        variant === 'mobile' && 'flex py-1'
      )}
    >
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className={cn(
          'rounded-full hover:bg-muted cursor-pointer',
          variant === 'mobile' && 'h-10 w-10'
        )}
        aria-label="Search"
      >
        <Search
          className={cn(
            'text-muted-foreground',
            variant === 'desktop' && 'h-4 w-4',
            variant === 'mobile' && 'h-5 w-5'
          )}
        />
      </Button>

      <Input
        name="query"
        value={value}
        required
        type="text"
        placeholder="Search..."
        onChange={(e) => setValue(e.target.value)}
        className={cn(
          'bg-transparent border-1 focus:ring-0 placeholder:opacity-80',
          variant === 'desktop' && 'h-8 w-48',
          variant === 'mobile' && 'h-8 w-full'
        )}
        aria-label="Search by posts"
      />
    </form>
  );
};

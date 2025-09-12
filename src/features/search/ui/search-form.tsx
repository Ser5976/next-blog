import Form from 'next/form';
import { Search } from 'lucide-react';

import { Button, Input } from '@/shared/ui';

export const SearchForm = () => {
  return (
    <Form
      action="/search"
      className="hidden md:flex items-center bg-muted/20 dark:bg-muted/10 rounded-full px-2 py-1"
    >
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="rounded-full hover:bg-muted cursor-pointer"
        aria-label="Search"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
      </Button>
      <Input
        name="query"
        type="search"
        placeholder="Search..."
        className="h-8 w-48 bg-transparent border-0 focus:ring-0 placeholder:opacity-80"
        aria-label="Search by posts"
      />
    </Form>
  );
};

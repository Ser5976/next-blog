'use client';

import { Info, Search } from 'lucide-react';

import { Input } from '@/shared/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { CommentsFiltersProps } from '../model';

export function CommentsFiltersComponent({
  filters,
  onFiltersChange,
}: CommentsFiltersProps) {
  return (
    <div
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
      role="search"
      aria-label="Comments filters"
      data-testid="comments-filters"
    >
      {/* Поиск с подсказкой */}
      <div className="flex-1 w-full">
        <div className="relative max-w-sm">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            placeholder="Search by content, author, or post..."
            className="pl-10 w-full pr-10"
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                search: e.target.value,
                page: 1,
              })
            }
            aria-label="Search comments by content, author, or post"
            data-testid="comment-search-input"
          />

          {/* Подсказка о возможностях поиска */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-help"
                  aria-label="Search tips"
                  data-testid="search-tips-icon"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Search by comment content, author name/email, or post title
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}

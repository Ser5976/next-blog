'use client';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

import { Button } from '@/shared/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  isLoading = false,
  className = '',
}: PaginationProps) {
  // Расчет диапазона
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}
    >
      {/* Results Info */}
      <div className="text-sm text-muted-foreground whitespace-nowrap">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Loading...</span>
          </div>
        ) : totalItems > 0 ? (
          <>
            <span className="font-medium">
              {startItem}-{endItem}
            </span>{' '}
            of{' '}
            <span className="font-medium">{totalItems.toLocaleString()}</span>
          </>
        ) : (
          '0 results'
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className="h-8 w-8"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 px-3 text-sm">
          <span className="font-medium">Page</span>
          <span className="font-semibold">{currentPage}</span>
          <span className="text-muted-foreground">of</span>
          <span className="font-semibold">{totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className="h-8 w-8"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

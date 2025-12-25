import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import { Button } from './button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
  'data-testid'?: string;
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  pageSizeOptions = [1, 3, 5, 10, 20, 50, 100],
  onPageChange,
  onItemsPerPageChange,
  className = '',
  'data-testid': testId = 'pagination',
}: PaginationProps) {
  // Рассчитываем диапазон
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${className}`}
      role="navigation"
      aria-label="Pagination"
      data-testid={testId}
    >
      {/* Левая часть: информация и выбор количества */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        data-testid="pagination-info-section"
      >
        {/* Информация о результатах */}
        <div
          className="text-sm text-muted-foreground whitespace-nowrap"
          data-testid="pagination-info"
          aria-label={`Showing items ${startItem} to ${endItem} of ${totalItems}`}
        >
          {totalItems > 0 ? (
            <>
              <span className="font-medium" data-testid="pagination-range">
                {startItem}-{endItem}
              </span>{' '}
              of{' '}
              <span className="font-medium" data-testid="pagination-total">
                {totalItems.toLocaleString()}
              </span>
            </>
          ) : (
            <span data-testid="pagination-no-results">0 results</span>
          )}
        </div>

        {/* Выбор количества элементов на странице */}
        {onItemsPerPageChange && (
          <div
            className="flex items-center gap-2"
            data-testid="page-size-selector"
          >
            <span
              className="text-sm text-muted-foreground hidden sm:inline"
              aria-hidden="true"
            >
              Show
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => onItemsPerPageChange(Number(value))}
              data-testid="page-size-select"
            >
              <SelectTrigger
                className="h-8 w-20 cursor-pointer"
                aria-label="Items per page"
                data-testid="page-size-trigger"
              >
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent data-testid="page-size-options">
                {pageSizeOptions.map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className="cursor-pointer"
                    data-testid={`page-size-option-${size}`}
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span
              className="text-sm text-muted-foreground hidden sm:inline"
              aria-hidden="true"
            >
              per page
            </span>
          </div>
        )}
      </div>

      {/* Правая часть: навигация */}
      <div
        className="flex items-center gap-1"
        data-testid="pagination-navigation"
      >
        {/* Первая страница */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="h-8 w-8 cursor-pointer"
          aria-label="First page"
          data-testid="pagination-first"
        >
          <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Предыдущая страница */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 cursor-pointer"
          aria-label="Previous page"
          data-testid="pagination-prev"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Номер текущей страницы и общее количество */}
        <div
          className="flex items-center gap-2 px-3 text-sm"
          data-testid="pagination-page-info"
        >
          <span className="font-medium" aria-hidden="true">
            Page
          </span>
          <span
            className="font-semibold"
            data-testid="current-page"
            aria-current="page"
          >
            {currentPage}
          </span>
          <span className="text-muted-foreground" aria-hidden="true">
            of
          </span>
          <span className="font-semibold" data-testid="total-pages">
            {totalPages}
          </span>
        </div>

        {/* Следующая страница */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 cursor-pointer"
          aria-label="Next page"
          data-testid="pagination-next"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>

        {/* Последняя страница */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 cursor-pointer"
          aria-label="Last page"
          data-testid="pagination-last"
        >
          <ChevronsRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

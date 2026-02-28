import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { CommentsFilters } from '../../model';
import { CommentsFiltersComponent } from '../comments-filters';

jest.mock('lucide-react', () => ({
  Info: () => <svg data-testid="search-tips-icon" />,
  Search: () => <svg data-testid="search-icon" />,
}));

const mockFilters: CommentsFilters = { page: 1, limit: 10, search: '' };

describe('CommentsFiltersComponent', () => {
  const mockOnFiltersChange = jest.fn();
  beforeEach(() => jest.clearAllMocks());

  it('renders without crashing', () => {
    render(
      <CommentsFiltersComponent
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    expect(screen.getByTestId('comments-filters')).toBeInTheDocument();
  });

  it('displays search input with current value', () => {
    render(
      <CommentsFiltersComponent
        filters={{ ...mockFilters, search: 'test' }}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    const input = screen.getByTestId(
      'comment-search-input'
    ) as HTMLInputElement;
    expect(input.value).toBe('test');
  });

  it('calls onFiltersChange when typing', async () => {
    const user = userEvent.setup();
    render(
      <CommentsFiltersComponent
        filters={mockFilters}
        onFiltersChange={mockOnFiltersChange}
      />
    );
    await user.type(screen.getByTestId('comment-search-input'), 'a');
    expect(mockOnFiltersChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ search: 'a', page: 1 })
    );
  });
});

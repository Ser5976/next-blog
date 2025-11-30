import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TimeFilter } from '../time-filter';

// Мокируем next/navigation
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

// Мокируем Button компонент
jest.mock('@/shared/ui', () => ({
  Button: ({
    children,
    variant,
    size,
    className,
    onClick,
    ...props
  }: React.ComponentProps<'button'> & {
    variant?: 'default' | 'outline';
    size?: 'sm';
  }) => (
    <button
      data-testid="time-filter-button"
      data-variant={variant}
      data-size={size}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  ),
}));

describe('TimeFilter', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSearchParams.delete('timeRange');
  });

  it('should render all three period buttons', () => {
    render(<TimeFilter initialPeriod="month" />);

    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
  });

  it('should highlight week button when initialPeriod is week', () => {
    render(<TimeFilter initialPeriod="week" />);

    const buttons = screen.getAllByTestId('time-filter-button');
    const weekButton = buttons.find((btn) => btn.textContent === 'Week');
    const monthButton = buttons.find((btn) => btn.textContent === 'Month');
    const yearButton = buttons.find((btn) => btn.textContent === 'Year');

    expect(weekButton).toHaveAttribute('data-variant', 'default');
    expect(monthButton).toHaveAttribute('data-variant', 'outline');
    expect(yearButton).toHaveAttribute('data-variant', 'outline');
  });

  it('should highlight month button when initialPeriod is month', () => {
    render(<TimeFilter initialPeriod="month" />);

    const buttons = screen.getAllByTestId('time-filter-button');
    const weekButton = buttons.find((btn) => btn.textContent === 'Week');
    const monthButton = buttons.find((btn) => btn.textContent === 'Month');
    const yearButton = buttons.find((btn) => btn.textContent === 'Year');

    expect(weekButton).toHaveAttribute('data-variant', 'outline');
    expect(monthButton).toHaveAttribute('data-variant', 'default');
    expect(yearButton).toHaveAttribute('data-variant', 'outline');
  });

  it('should highlight year button when initialPeriod is year', () => {
    render(<TimeFilter initialPeriod="year" />);

    const buttons = screen.getAllByTestId('time-filter-button');
    const weekButton = buttons.find((btn) => btn.textContent === 'Week');
    const monthButton = buttons.find((btn) => btn.textContent === 'Month');
    const yearButton = buttons.find((btn) => btn.textContent === 'Year');

    expect(weekButton).toHaveAttribute('data-variant', 'outline');
    expect(monthButton).toHaveAttribute('data-variant', 'outline');
    expect(yearButton).toHaveAttribute('data-variant', 'default');
  });

  it('should call router.push with week when week button is clicked', async () => {
    render(<TimeFilter initialPeriod="month" />);

    const weekButton = screen
      .getAllByTestId('time-filter-button')
      .find((btn) => btn.textContent === 'Week');

    if (weekButton) {
      await user.click(weekButton);
    }

    expect(mockPush).toHaveBeenCalledWith('?timeRange=week', {
      scroll: false,
    });
  });

  it('should call router.push with month when month button is clicked', async () => {
    render(<TimeFilter initialPeriod="week" />);

    const monthButton = screen
      .getAllByTestId('time-filter-button')
      .find((btn) => btn.textContent === 'Month');

    if (monthButton) {
      await user.click(monthButton);
    }

    expect(mockPush).toHaveBeenCalledWith('?timeRange=month', {
      scroll: false,
    });
  });

  it('should call router.push with year when year button is clicked', async () => {
    render(<TimeFilter initialPeriod="month" />);

    const yearButton = screen
      .getAllByTestId('time-filter-button')
      .find((btn) => btn.textContent === 'Year');

    if (yearButton) {
      await user.click(yearButton);
    }

    expect(mockPush).toHaveBeenCalledWith('?timeRange=year', {
      scroll: false,
    });
  });

  it('should preserve existing search params when changing period', async () => {
    mockSearchParams.set('otherParam', 'value');
    render(<TimeFilter initialPeriod="month" />);

    const weekButton = screen
      .getAllByTestId('time-filter-button')
      .find((btn) => btn.textContent === 'Week');

    if (weekButton) {
      await user.click(weekButton);
    }

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('timeRange=week'),
      { scroll: false }
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('otherParam=value'),
      { scroll: false }
    );
  });

  it('should have correct size prop for all buttons', () => {
    render(<TimeFilter initialPeriod="month" />);

    const buttons = screen.getAllByTestId('time-filter-button');
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('data-size', 'sm');
    });
  });

  it('should have cursor-pointer class on all buttons', () => {
    render(<TimeFilter initialPeriod="month" />);

    const buttons = screen.getAllByTestId('time-filter-button');
    buttons.forEach((button) => {
      expect(button).toHaveClass('cursor-pointer');
    });
  });

  it('should render with correct structure', () => {
    const { container } = render(<TimeFilter initialPeriod="month" />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex', 'items-center', 'gap-2');
  });

  it('should handle multiple clicks correctly', async () => {
    // Очищаем searchParams для этого теста
    mockSearchParams.delete('otherParam');
    render(<TimeFilter initialPeriod="month" />);

    const weekButton = screen
      .getAllByTestId('time-filter-button')
      .find((btn) => btn.textContent === 'Week');
    const yearButton = screen
      .getAllByTestId('time-filter-button')
      .find((btn) => btn.textContent === 'Year');

    if (weekButton && yearButton) {
      await user.click(weekButton);
      await user.click(yearButton);

      expect(mockPush).toHaveBeenCalledTimes(2);
      expect(mockPush).toHaveBeenNthCalledWith(1, '?timeRange=week', {
        scroll: false,
      });
      expect(mockPush).toHaveBeenNthCalledWith(2, '?timeRange=year', {
        scroll: false,
      });
    }
  });
});

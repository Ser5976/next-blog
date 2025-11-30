import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { FileText } from 'lucide-react';

import { StatCard } from '../stat-card';

// Мокируем Card компоненты
jest.mock('@/shared/ui/card', () => ({
  Card: ({
    children,
    className,
    role,
    ...props
  }: React.ComponentProps<'div'> & { role?: string }) => (
    <div data-testid="card" className={className} role={role} {...props}>
      {children}
    </div>
  ),
  CardHeader: ({
    children,
    className,
    ...props
  }: React.ComponentProps<'div'>) => (
    <div data-testid="card-header" className={className} {...props}>
      {children}
    </div>
  ),
  CardTitle: ({
    children,
    className,
    id,
    ...props
  }: React.ComponentProps<'div'> & { id?: string }) => (
    <div data-testid="card-title" className={className} id={id} {...props}>
      {children}
    </div>
  ),
  CardContent: ({
    children,
    className,
    ...props
  }: React.ComponentProps<'div'>) => (
    <div data-testid="card-content" className={className} {...props}>
      {children}
    </div>
  ),
}));

// Мокируем иконки
jest.mock('lucide-react', () => ({
  FileText: ({
    className,
    'aria-hidden': ariaHidden,
  }: React.SVGProps<SVGSVGElement>) => (
    <svg
      data-testid="icon-filetext"
      className={className}
      aria-hidden={ariaHidden}
    >
      Icon
    </svg>
  ),
  ArrowUp: ({
    className,
    'aria-hidden': ariaHidden,
  }: React.SVGProps<SVGSVGElement>) => (
    <svg
      data-testid="icon-arrow-up"
      className={className}
      aria-hidden={ariaHidden}
    >
      ArrowUp
    </svg>
  ),
  ArrowDown: ({
    className,
    'aria-hidden': ariaHidden,
  }: React.SVGProps<SVGSVGElement>) => (
    <svg
      data-testid="icon-arrow-down"
      className={className}
      aria-hidden={ariaHidden}
    >
      ArrowDown
    </svg>
  ),
}));

describe('StatCard', () => {
  const mockProps = {
    title: 'Total Posts',
    value: 150,
    icon: FileText,
    description: 'Published articles',
  };

  it('should render with required props', () => {
    render(<StatCard {...mockProps} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Total Posts')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('Published articles')).toBeInTheDocument();
    expect(screen.getByTestId('icon-filetext')).toBeInTheDocument();
  });

  it('should render with positive trend', () => {
    render(<StatCard {...mockProps} trend={12} />);

    expect(
      screen.getByText('12% from the previous period')
    ).toBeInTheDocument();
    expect(screen.getByTestId('icon-arrow-up')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-arrow-down')).not.toBeInTheDocument();
  });

  it('should render with negative trend', () => {
    render(<StatCard {...mockProps} trend={-5} />);

    expect(screen.getByText('5% from the previous period')).toBeInTheDocument();
    expect(screen.getByTestId('icon-arrow-down')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-arrow-up')).not.toBeInTheDocument();
  });

  it('should render without trend when not provided', () => {
    render(<StatCard {...mockProps} />);

    expect(
      screen.queryByText(/from the previous period/)
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-arrow-up')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-arrow-down')).not.toBeInTheDocument();
  });

  it('should not render trend when trend is zero', () => {
    render(<StatCard {...mockProps} trend={0} />);

    // trend={0} is falsy, so trend block should not render
    expect(
      screen.queryByText(/from the previous period/)
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-arrow-up')).not.toBeInTheDocument();
    expect(screen.queryByTestId('icon-arrow-down')).not.toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<StatCard {...mockProps} />);

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute('role', 'region');
    expect(card).toHaveAttribute('aria-labelledby', 'stat-title-total-posts');

    const title = screen.getByTestId('card-title');
    expect(title).toHaveAttribute('id', 'stat-title-total-posts');

    const icon = screen.getByTestId('icon-filetext');
    expect(icon).toHaveAttribute('aria-hidden', 'true');

    const value = screen.getByText('150');
    expect(value).toHaveAttribute('aria-live', 'polite');
  });

  it('should generate correct id from title with spaces', () => {
    render(<StatCard {...mockProps} title="Total Articles Count" />);

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute(
      'aria-labelledby',
      'stat-title-total-articles-count'
    );
  });

  it('should generate correct id from title with special characters', () => {
    render(<StatCard {...mockProps} title="Total Articles & Posts!" />);

    const card = screen.getByTestId('card');
    expect(card).toHaveAttribute(
      'aria-labelledby',
      'stat-title-total-articles-&-posts!'
    );
  });

  it('should have correct aria-label for positive trend', () => {
    render(<StatCard {...mockProps} trend={15} />);

    const trendElement = screen.getByRole('status');
    expect(trendElement).toHaveAttribute(
      'aria-label',
      'Trend is up by 15 percent from the previous period'
    );
  });

  it('should have correct aria-label for negative trend', () => {
    render(<StatCard {...mockProps} trend={-8} />);

    const trendElement = screen.getByRole('status');
    expect(trendElement).toHaveAttribute(
      'aria-label',
      'Trend is down by 8 percent from the previous period'
    );
  });

  it('should apply correct CSS classes for positive trend', () => {
    render(<StatCard {...mockProps} trend={10} />);

    const trendElement = screen.getByRole('status');
    expect(trendElement).toHaveClass('text-emerald-600');
    expect(trendElement).not.toHaveClass('text-red-600');
  });

  it('should apply correct CSS classes for negative trend', () => {
    render(<StatCard {...mockProps} trend={-5} />);

    const trendElement = screen.getByRole('status');
    expect(trendElement).toHaveClass('text-red-600');
    expect(trendElement).not.toHaveClass('text-emerald-600');
  });

  it('should render with different value types', () => {
    render(<StatCard {...mockProps} value={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();

    render(<StatCard {...mockProps} value={999999} />);
    expect(screen.getByText('999999')).toBeInTheDocument();
  });

  it('should render description correctly', () => {
    render(<StatCard {...mockProps} description="Custom description text" />);

    expect(screen.getByText('Custom description text')).toBeInTheDocument();
  });

  it('should have proper structure with all elements', () => {
    render(<StatCard {...mockProps} trend={5} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });
});

import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { SkeletonLoader } from '../skeleton-loader';

// Мокируем Card компоненты
jest.mock('@/shared/ui/card', () => ({
  Card: ({ children, className, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="card" className={className} {...props}>
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

describe('SkeletonLoader', () => {
  it('should render with default props', () => {
    render(<SkeletonLoader />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('should apply default className', () => {
    render(<SkeletonLoader />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('relative', 'overflow-hidden', 'animate-pulse');
  });

  it('should apply custom className', () => {
    render(<SkeletonLoader className="custom-class" />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class');
    expect(card).toHaveClass('animate-pulse');
  });

  it('should render skeleton elements', () => {
    render(<SkeletonLoader />);

    // Проверяем наличие скелетон элементов
    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should have correct structure', () => {
    render(<SkeletonLoader />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('should render with empty className string', () => {
    render(<SkeletonLoader className="" />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('animate-pulse');
  });
});

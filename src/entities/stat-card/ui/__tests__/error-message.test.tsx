import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ErrorMessage } from '../error-message';

// Мокируем Card компоненты
jest.mock('@/shared/ui/card', () => ({
  Card: ({ children, className, ...props }: React.ComponentProps<'div'>) => (
    <div data-testid="card" className={className} {...props}>
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

// Мокируем иконку
jest.mock('lucide-react', () => ({
  AlertCircle: ({ className }: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="icon-alert-circle" className={className}>
      Alert
    </svg>
  ),
}));

describe('ErrorMessage', () => {
  it('should render with required message prop', () => {
    render(<ErrorMessage message="Something went wrong!" />);

    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('should render with default title', () => {
    render(<ErrorMessage message="Error message" />);

    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('should render with custom title', () => {
    render(<ErrorMessage title="Custom Error Title" message="Error message" />);

    expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
  });

  it('should render AlertCircle icon', () => {
    render(<ErrorMessage message="Error message" />);

    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
  });

  it('should render retry button when onRetry is provided', () => {
    const mockRetry = jest.fn();
    render(<ErrorMessage message="Error message" onRetry={mockRetry} />);

    const retryButton = screen.getByText('Try Again');
    expect(retryButton).toBeInTheDocument();
    expect(retryButton.tagName).toBe('BUTTON');
  });

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Error message" />);

    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    const mockRetry = jest.fn();

    render(<ErrorMessage message="Error message" onRetry={mockRetry} />);

    const retryButton = screen.getByText('Try Again');
    await user.click(retryButton);

    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('should apply default className', () => {
    render(<ErrorMessage message="Error message" />);

    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<ErrorMessage message="Error message" className="custom-class" />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('custom-class');
  });

  it('should have correct structure', () => {
    render(<ErrorMessage message="Error message" />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-content')).toBeInTheDocument();
  });

  it('should render all elements correctly', () => {
    const mockRetry = jest.fn();
    render(
      <ErrorMessage
        title="Custom Title"
        message="Custom message"
        onRetry={mockRetry}
        className="custom-class"
      />
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
    expect(screen.getByTestId('icon-alert-circle')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toHaveClass('custom-class');
  });

  it('should handle empty message', () => {
    render(<ErrorMessage message="" />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
  });
});

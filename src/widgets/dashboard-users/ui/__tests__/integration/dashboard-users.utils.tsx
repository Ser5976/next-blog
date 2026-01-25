import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

export function renderWithProviders(ui: React.ReactElement) {
  const client = createTestQueryClient();

  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
}

export function getPaginationButtons(testId: string) {
  const root = screen.getByTestId(testId);

  return {
    prev: within(root).getByTestId(`${testId}-prev-page-button`),
    next: within(root).getByTestId(`${testId}-next-page-button`),
  };
}
// пустой тест , чтобы  не ругался jest
describe('Utils setup', () => {
  it.todo('should provide test utilities');
});

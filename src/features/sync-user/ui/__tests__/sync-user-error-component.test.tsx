import { render, screen } from '@testing-library/react';

import { ERROR_CONFIGS } from '../../lib/error-config';
import { useSyncError } from '../../model';
import { SyncUserErrorComponent } from '../sync-user-error-component';

// Мокируем хук useSyncError
jest.mock('../../model/use-sync-error');

const mockUseSyncError = useSyncError as jest.Mock;

describe('SyncUserErrorComponent', () => {
  it('should render the error details from useSyncError hook', () => {
    // Arrange
    const syncFailedConfig = ERROR_CONFIGS.sync_failed;
    mockUseSyncError.mockReturnValue({
      errorTitle: syncFailedConfig.title,
      errorMessage: syncFailedConfig.message,
      errorActions: syncFailedConfig.actions,
    });

    // Act
    render(<SyncUserErrorComponent />);

    // Assert
    expect(
      screen.getByRole('heading', { name: syncFailedConfig.title })
    ).toBeInTheDocument();
    expect(screen.getByText(syncFailedConfig.message)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Try registration again' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to home page' })
    ).toBeInTheDocument();
  });

  it('should render default error details correctly', () => {
    // Arrange
    const defaultConfig = ERROR_CONFIGS.default;
    mockUseSyncError.mockReturnValue({
      errorTitle: defaultConfig.title,
      errorMessage: defaultConfig.message,
      errorActions: defaultConfig.actions,
    });

    // Act
    render(<SyncUserErrorComponent />);

    // Assert
    expect(
      screen.getByRole('heading', { name: defaultConfig.title })
    ).toBeInTheDocument();
    expect(screen.getByText(defaultConfig.message)).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Try registration again' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to home page' })
    ).toBeInTheDocument();
  });
});

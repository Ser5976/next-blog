import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { useTheme } from '../model/use-theme';
import { ThemeToggle } from './theme-togle';

// Мокаем хук useTheme
jest.mock('../model/use-theme');

const mockSetTheme = jest.fn();

beforeEach(() => {
  (useTheme as jest.Mock).mockReturnValue({
    setTheme: mockSetTheme,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('ThemeToggle', () => {
  // проверяем каждый клик отдельно
  it('calls setTheme with light when light item is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const triggerButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(triggerButton);

    const lightItem = await screen.findByRole('menuitem', { name: /light/i });
    await user.click(lightItem);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('calls setTheme with dark when dark item is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const triggerButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(triggerButton);

    const darkItem = await screen.findByRole('menuitem', { name: /dark/i });
    await user.click(darkItem);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('calls setTheme with system when system item is clicked', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    const triggerButton = screen.getByRole('button', { name: /toggle theme/i });
    await user.click(triggerButton);

    const systemItem = await screen.findByRole('menuitem', { name: /system/i });
    await user.click(systemItem);

    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });
});

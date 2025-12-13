import { render, screen } from '@testing-library/react';

import { getUsersStats } from '@/features/users-stats/api';
import { UsersStats } from '../users-stats';

jest.mock('@/features/users-stats/api', () => ({
  getUsersStats: jest.fn(),
}));

jest.mock('@/entities/stat-card', () => ({
  StatCard: jest.fn(({ title, value, trend, description }) => (
    <div>
      <h1>{title}</h1>
      <p>Value: {value}</p>
      <p>Trend: {trend}</p>
      <p>{description}</p>
    </div>
  )),
  ErrorMessage: jest.fn(({ message }) => <div>Error: {message}</div>),
}));

const mockGetUsersStats = getUsersStats as jest.Mock;

describe('UsersStats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render StatCard with correct data on successful fetch', async () => {
    const mockData = {
      totalUsers: { current: 1000, previous: 800, change: 25 },
    };
    mockGetUsersStats.mockResolvedValue(mockData);

    const jsx = await UsersStats({ timeRange: 'week' });
    render(jsx);

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Value: 1000')).toBeInTheDocument();
    expect(screen.getByText('Trend: 25')).toBeInTheDocument();
    expect(screen.getByText('Registered readers')).toBeInTheDocument();
  });

  it('should render ErrorMessage when stats are not available', async () => {
    mockGetUsersStats.mockResolvedValue(null);

    const jsx = await UsersStats({ timeRange: 'week' });
    render(jsx);

    expect(
      screen.getByText('Error: Something went wrong!')
    ).toBeInTheDocument();
  });

  it('should handle large user counts', async () => {
    const mockData = {
      totalUsers: { current: 50000, previous: 45000, change: 11.1 },
    };
    mockGetUsersStats.mockResolvedValue(mockData);

    const jsx = await UsersStats({ timeRange: 'month' });
    render(jsx);

    expect(screen.getByText('Value: 50000')).toBeInTheDocument();
  });

  it('should handle negative user growth', async () => {
    const mockData = {
      totalUsers: { current: 950, previous: 1000, change: -5 },
    };
    mockGetUsersStats.mockResolvedValue(mockData);

    const jsx = await UsersStats({ timeRange: 'year' });
    render(jsx);

    expect(screen.getByText('Trend: -5')).toBeInTheDocument();
  });

  it('should render with all timeRange options', async () => {
    const mockData = {
      totalUsers: { current: 1200, previous: 1100, change: 9.1 },
    };
    mockGetUsersStats.mockResolvedValue(mockData);

    const timeRanges = ['week', 'month', 'year'] as const;

    for (const timeRange of timeRanges) {
      const jsx = await UsersStats({ timeRange });
      const { unmount } = render(jsx);

      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(mockGetUsersStats).toHaveBeenCalledWith(timeRange);

      unmount();
      jest.clearAllMocks();
    }
  });
});

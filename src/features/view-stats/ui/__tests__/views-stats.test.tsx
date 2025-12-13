import { render, screen } from '@testing-library/react';

import { getViewsStats } from '@/features/view-stats/api';
import { ViewsStats } from '../views-stats';

jest.mock('@/features/view-stats/api', () => ({
  getViewsStats: jest.fn(),
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

const mockGetViewsStats = getViewsStats as jest.Mock;

describe('ViewsStats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render StatCard with correct data on successful fetch', async () => {
    const mockData = {
      totalViews: { current: 10000, previous: 8000, change: 25 },
    };
    mockGetViewsStats.mockResolvedValue(mockData);

    const jsx = await ViewsStats({ timeRange: 'week' });
    render(jsx);

    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('Value: 10000')).toBeInTheDocument();
    expect(screen.getByText('Trend: 25')).toBeInTheDocument();
    expect(screen.getByText('For all the time')).toBeInTheDocument();
  });

  it('should render ErrorMessage when stats are not available', async () => {
    mockGetViewsStats.mockResolvedValue(null);

    const jsx = await ViewsStats({ timeRange: 'week' });
    render(jsx);

    expect(
      screen.getByText('Error: Something went wrong!')
    ).toBeInTheDocument();
  });

  it('should format large numbers correctly', async () => {
    const mockData = {
      totalViews: { current: 1234567, previous: 1000000, change: 23.5 },
    };
    mockGetViewsStats.mockResolvedValue(mockData);

    const jsx = await ViewsStats({ timeRange: 'month' });
    render(jsx);

    expect(screen.getByText('Value: 1234567')).toBeInTheDocument();
  });

  it('should handle different timeRange values', async () => {
    const mockData = {
      totalViews: { current: 5000, previous: 4500, change: 11.1 },
    };
    mockGetViewsStats.mockResolvedValue(mockData);

    const timeRanges = ['week', 'month', 'year'] as const;

    for (const timeRange of timeRanges) {
      const jsx = await ViewsStats({ timeRange });
      const { unmount } = render(jsx);

      expect(screen.getByText('Views')).toBeInTheDocument();
      expect(mockGetViewsStats).toHaveBeenCalledWith(timeRange);

      unmount();
      jest.clearAllMocks();
    }
  });
});

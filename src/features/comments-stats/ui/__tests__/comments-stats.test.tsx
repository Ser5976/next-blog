import { render, screen } from '@testing-library/react';

import { getCommentsStats } from '../../api';
import { CommentsStats } from '../comments-stats';

jest.mock('@/features/comments-stats/api', () => ({
  getCommentsStats: jest.fn(),
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

const mockGetCommentsStats = getCommentsStats as jest.Mock;

describe('CommentsStats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render StatCard with correct data on successful fetch', async () => {
    const mockData = {
      totalComments: { current: 150, previous: 120, change: 25 },
    };
    mockGetCommentsStats.mockResolvedValue(mockData);

    const jsx = await CommentsStats({ timeRange: 'week' });
    render(jsx);

    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('Value: 150')).toBeInTheDocument();
    expect(screen.getByText('Trend: 25')).toBeInTheDocument();
    expect(screen.getByText('Community activity')).toBeInTheDocument();
  });

  it('should render ErrorMessage when stats are not available', async () => {
    mockGetCommentsStats.mockResolvedValue(null);

    const jsx = await CommentsStats({ timeRange: 'week' });
    render(jsx);

    expect(
      screen.getByText('Error: Something went wrong!')
    ).toBeInTheDocument();
  });

  it('should render with different timeRange values', async () => {
    const mockData = {
      totalComments: { current: 200, previous: 180, change: 11.1 },
    };
    mockGetCommentsStats.mockResolvedValue(mockData);

    const timeRanges = ['week', 'month', 'year'] as const;

    for (const timeRange of timeRanges) {
      const jsx = await CommentsStats({ timeRange });
      const { unmount } = render(jsx);

      expect(screen.getByText('Comments')).toBeInTheDocument();
      expect(mockGetCommentsStats).toHaveBeenCalledWith(timeRange);

      unmount();
      jest.clearAllMocks();
    }
  });

  it('should handle zero values correctly', async () => {
    const mockData = {
      totalComments: { current: 0, previous: 0, change: 0 },
    };
    mockGetCommentsStats.mockResolvedValue(mockData);

    const jsx = await CommentsStats({ timeRange: 'month' });
    render(jsx);

    expect(screen.getByText('Value: 0')).toBeInTheDocument();
    expect(screen.getByText('Trend: 0')).toBeInTheDocument();
    expect(screen.getByText('Community activity')).toBeInTheDocument();
  });

  it('should handle negative trend', async () => {
    const mockData = {
      totalComments: { current: 100, previous: 120, change: -16.7 },
    };
    mockGetCommentsStats.mockResolvedValue(mockData);

    const jsx = await CommentsStats({ timeRange: 'year' });
    render(jsx);

    expect(screen.getByText('Trend: -16.7')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';

import { getPostsStats } from '@/features/posts-stats/api';
import { PostsStats } from '../posts-stats';

jest.mock('@/features/posts-stats/api', () => ({
  getPostsStats: jest.fn(),
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

const mockGetPostsStats = getPostsStats as jest.Mock;

describe('PostsStats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render StatCard with correct data on successful fetch', async () => {
    const mockData = {
      totalPosts: { current: 150, previous: 120, change: 25 },
      publishedPosts: { current: 120, previous: 100, change: 20 },
    };
    mockGetPostsStats.mockResolvedValue(mockData);

    const jsx = await PostsStats({ timeRange: 'week' });
    render(jsx);

    expect(screen.getByText('Total articles')).toBeInTheDocument();
    expect(screen.getByText('Value: 150')).toBeInTheDocument();
    expect(screen.getByText('Trend: 25')).toBeInTheDocument();
    expect(screen.getByText('120 published')).toBeInTheDocument();
  });

  it('should render ErrorMessage when stats are not available', async () => {
    mockGetPostsStats.mockResolvedValue(null);

    const jsx = await PostsStats({ timeRange: 'week' });
    render(jsx);

    expect(
      screen.getByText('Error: Something went wrong!')
    ).toBeInTheDocument();
  });

  it('should render with different timeRange values', async () => {
    const mockData = {
      totalPosts: { current: 200, previous: 180, change: 11.1 },
      publishedPosts: { current: 150, previous: 140, change: 7.1 },
    };
    mockGetPostsStats.mockResolvedValue(mockData);

    const timeRanges = ['week', 'month', 'year'] as const;

    for (const timeRange of timeRanges) {
      const jsx = await PostsStats({ timeRange });
      const { unmount } = render(jsx);

      expect(screen.getByText('Total articles')).toBeInTheDocument();
      expect(mockGetPostsStats).toHaveBeenCalledWith(timeRange);

      unmount();
      jest.clearAllMocks();
    }
  });

  it('should handle zero values correctly', async () => {
    const mockData = {
      totalPosts: { current: 0, previous: 0, change: 0 },
      publishedPosts: { current: 0, previous: 0, change: 0 },
    };
    mockGetPostsStats.mockResolvedValue(mockData);

    const jsx = await PostsStats({ timeRange: 'month' });
    render(jsx);

    expect(screen.getByText('Value: 0')).toBeInTheDocument();
    expect(screen.getByText('Trend: 0')).toBeInTheDocument();
    expect(screen.getByText('0 published')).toBeInTheDocument();
  });

  it('should handle negative trend', async () => {
    const mockData = {
      totalPosts: { current: 100, previous: 120, change: -16.7 },
      publishedPosts: { current: 80, previous: 90, change: -11.1 },
    };
    mockGetPostsStats.mockResolvedValue(mockData);

    const jsx = await PostsStats({ timeRange: 'year' });
    render(jsx);

    expect(screen.getByText('Trend: -16.7')).toBeInTheDocument();
  });
});

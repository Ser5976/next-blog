import { render, screen } from '@testing-library/react';

import { getPoststStats } from '@/features/posts-stats/api';
import { PostsStats } from '../posts-stats';

jest.mock('@/features/posts-stats/api', () => ({
  getPoststStats: jest.fn(),
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

const mockGetPoststStats = getPoststStats as jest.Mock;

describe('PostsStats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render StatCard with correct data on successful fetch', async () => {
    const mockData = {
      totalPosts: { current: 150, change: 12 },
      publishedPosts: { current: 120 },
    };
    mockGetPoststStats.mockResolvedValue(mockData);

    const jsx = await PostsStats({ timeRange: 'week' });
    render(jsx);

    expect(screen.getByText('Total articles')).toBeInTheDocument();
    expect(screen.getByText('Value: 150')).toBeInTheDocument();
    expect(screen.getByText('Trend: 12')).toBeInTheDocument();
    expect(screen.getByText('120 published')).toBeInTheDocument();
  });

  it('should render ErrorMessage when stats are not available', async () => {
    mockGetPoststStats.mockResolvedValue(null);

    const jsx = await PostsStats({ timeRange: 'week' });
    render(jsx);

    expect(
      screen.getByText('Error: Something went wrong!')
    ).toBeInTheDocument();
  });
});

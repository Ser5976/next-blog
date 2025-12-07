import { render, screen } from '@testing-library/react';

import { getCommentsStats } from '@/features/comments-stats/api';
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
      totalComments: { current: 250, previous: 200, change: 15 },
    };
    mockGetCommentsStats.mockResolvedValue(mockData);

    const jsx = await CommentsStats({ timeRange: 'week' });
    render(jsx);

    expect(screen.getByText('Comments')).toBeInTheDocument();
    expect(screen.getByText('Value: 250')).toBeInTheDocument();
    expect(screen.getByText('Trend: 15')).toBeInTheDocument();
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
});

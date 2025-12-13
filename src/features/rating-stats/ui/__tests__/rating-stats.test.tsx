import { render, screen } from '@testing-library/react';

import { getRatingStats } from '@/features/rating-stats/api';
import { RatingStats } from '../rating-stats';

jest.mock('@/features/rating-stats/api', () => ({
  getRatingStats: jest.fn(),
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

const mockGetRatingStats = getRatingStats as jest.Mock;

describe('RatingStats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render StatCard with correct data on successful fetch', async () => {
    const mockData = {
      averageRating: { current: 4.5, previous: 4.2, change: 7.1 },
    };
    mockGetRatingStats.mockResolvedValue(mockData);

    const jsx = await RatingStats({ timeRange: 'week' });
    render(jsx);

    expect(screen.getByText('Average rating')).toBeInTheDocument();
    expect(screen.getByText('Value: 4.5')).toBeInTheDocument();
    expect(screen.getByText('Trend: 7.1')).toBeInTheDocument();
    expect(screen.getByText('Based on user ratings')).toBeInTheDocument();
  });

  it('should render ErrorMessage when stats are not available', async () => {
    mockGetRatingStats.mockResolvedValue(null);

    const jsx = await RatingStats({ timeRange: 'week' });
    render(jsx);

    expect(
      screen.getByText('Error: Something went wrong!')
    ).toBeInTheDocument();
  });

  it('should handle decimal rating values', async () => {
    const mockData = {
      averageRating: { current: 3.75, previous: 3.5, change: 7.1 },
    };
    mockGetRatingStats.mockResolvedValue(mockData);

    const jsx = await RatingStats({ timeRange: 'month' });
    render(jsx);

    expect(screen.getByText('Value: 3.75')).toBeInTheDocument();
  });

  it('should handle perfect rating', async () => {
    const mockData = {
      averageRating: { current: 5.0, previous: 4.8, change: 4.2 },
    };
    mockGetRatingStats.mockResolvedValue(mockData);

    const jsx = await RatingStats({ timeRange: 'year' });
    render(jsx);

    expect(screen.getByText('Value: 5')).toBeInTheDocument();
  });

  it('should handle small trend changes', async () => {
    const mockData = {
      averageRating: { current: 4.1, previous: 4.0, change: 2.5 },
    };
    mockGetRatingStats.mockResolvedValue(mockData);

    const jsx = await RatingStats({ timeRange: 'week' });
    render(jsx);

    expect(screen.getByText('Trend: 2.5')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';

import { getEfficiencyStats } from '@/features/efficiency/api';
import { EfficiencyStats } from '../efficiency-stats';

jest.mock('@/features/efficiency/api', () => ({
  getEfficiencyStats: jest.fn(),
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

const mockGetEfficiencyStats = getEfficiencyStats as jest.Mock;

describe('EfficiencyStats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render StatCard with correct data on successful fetch', async () => {
    const mockData = {
      efficiency: { current: 85, previous: 80, change: 6.25 },
    };
    mockGetEfficiencyStats.mockResolvedValue(mockData);

    const jsx = await EfficiencyStats({ timeRange: 'week' });
    render(jsx);

    expect(screen.getByText('Efficiency')).toBeInTheDocument();
    expect(screen.getByText('Value: 85')).toBeInTheDocument();
    expect(screen.getByText('Trend: 6.25')).toBeInTheDocument();
    expect(
      screen.getByText('Published from the total number')
    ).toBeInTheDocument();
  });

  it('should render ErrorMessage when stats are not available', async () => {
    mockGetEfficiencyStats.mockResolvedValue(null);

    const jsx = await EfficiencyStats({ timeRange: 'week' });
    render(jsx);

    expect(
      screen.getByText('Error: Something went wrong!')
    ).toBeInTheDocument();
  });

  it('should handle perfect efficiency', async () => {
    const mockData = {
      efficiency: { current: 100, previous: 95, change: 5.3 },
    };
    mockGetEfficiencyStats.mockResolvedValue(mockData);

    const jsx = await EfficiencyStats({ timeRange: 'month' });
    render(jsx);

    expect(screen.getByText('Value: 100')).toBeInTheDocument();
  });

  it('should handle low efficiency', async () => {
    const mockData = {
      efficiency: { current: 30, previous: 35, change: -14.3 },
    };
    mockGetEfficiencyStats.mockResolvedValue(mockData);

    const jsx = await EfficiencyStats({ timeRange: 'year' });
    render(jsx);

    expect(screen.getByText('Value: 30')).toBeInTheDocument();
    expect(screen.getByText('Trend: -14.3')).toBeInTheDocument();
  });

  it('should test all timeRange values', async () => {
    const mockData = {
      efficiency: { current: 75, previous: 70, change: 7.1 },
    };
    mockGetEfficiencyStats.mockResolvedValue(mockData);

    const timeRanges = ['week', 'month', 'year'] as const;

    for (const timeRange of timeRanges) {
      const jsx = await EfficiencyStats({ timeRange });
      const { unmount } = render(jsx);

      expect(screen.getByText('Efficiency')).toBeInTheDocument();
      expect(mockGetEfficiencyStats).toHaveBeenCalledWith(timeRange);

      unmount();
      jest.clearAllMocks();
    }
  });
});

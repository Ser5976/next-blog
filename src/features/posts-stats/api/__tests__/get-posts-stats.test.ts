import { getPoststStats } from '@/features/posts-stats/api/get-posts-stats';

describe('getPoststStats', () => {
  const originalFetch = global.fetch;
  const originalNextPublicDomain = process.env.NEXT_PUBLIC_DOMAIN;

  beforeAll(() => {
    process.env.NEXT_PUBLIC_DOMAIN = 'http://localhost:3000';
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_DOMAIN = originalNextPublicDomain;
  });

  it('should return post stats on successful fetch', async () => {
    const mockStats = {
      totalPosts: { current: 100, change: 10 },
      publishedPosts: { current: 80 },
    };
    const mockResponse = {
      ok: true,
      json: async () => mockStats,
    } as Response;

    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    const timeRange = 'week';
    const result = await getPoststStats(timeRange);

    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/dashboard/posts?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );
    expect(result).toEqual(mockStats);
  });

  it('should return null when fetch is not successful', async () => {
    const mockResponse = {
      ok: false,
    } as Response;

    global.fetch = jest.fn(() => Promise.resolve(mockResponse));

    const timeRange = 'month';
    const result = await getPoststStats(timeRange);

    expect(global.fetch).toHaveBeenCalledWith(
      `http://localhost:3000/api/dashboard/posts?timeRange=${timeRange}`,
      {
        next: { revalidate: 60 },
      }
    );
    expect(result).toBeNull();
  });
});

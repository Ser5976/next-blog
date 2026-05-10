import axios from 'axios';

import { AuthorStatsResponse } from '../model';

export async function getAuthorStats(
  timeRange: 'week' | 'month' | 'year'
): Promise<AuthorStatsResponse> {
  try {
    const { data } = await axios.get<AuthorStatsResponse>('/api/author/stats', {
      params: { timeRange },
    });

    return data;
  } catch (error) {
    console.error('getAuthorStats error:', error);
    throw new Error('Failed to fetch author stats');
  }
}

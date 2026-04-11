import axios from 'axios';

import { ArticlesFilters } from '@/shared/api';
import { ArticlesResponse } from '../model';

export async function getArticles(
  filters: ArticlesFilters
): Promise<ArticlesResponse> {
  try {
    const { data } = await axios.get<ArticlesResponse>('/api/posts', {
      params: filters,
    });
    return data;
  } catch (error) {
    console.error('getArticles: error:', error);
    throw new Error('Something went wrong, articles were not received');
  }
}

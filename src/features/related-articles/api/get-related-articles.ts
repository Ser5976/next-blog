import axios from 'axios';

import { Article } from '@/shared/types';

export async function getRelatedArticles(
  slug: string,
  limit: number = 3
): Promise<Article[]> {
  const { data } = await axios.get<Article[]>(
    `/api/posts/slug/${slug}/related?limit=${limit}`
  );
  return data;
}

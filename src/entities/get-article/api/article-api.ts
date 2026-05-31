import axios from 'axios';

import { Article } from '@/shared/types';

export async function getArticle(slug: string | null): Promise<Article | null> {
  if (!slug) return null;
  try {
    const { data } = await axios.get<Article>(`/api/posts/slug/${slug}`);
    return data;
  } catch (error) {
    console.error('getArticle: error:', error);
    throw new Error('Something went wrong, article was not received');
  }
}

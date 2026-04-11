import axios from 'axios';

import { Article } from '@/shared/types';

export async function getArticle(
  articleId: string | null
): Promise<Article | null> {
  if (!articleId) return null;
  try {
    const { data } = await axios.get<Article>(`/api/posts/${articleId}`);
    return data;
  } catch (error) {
    console.error('getArticle: error:', error);
    throw new Error('Something went wrong, article was not received');
  }
}

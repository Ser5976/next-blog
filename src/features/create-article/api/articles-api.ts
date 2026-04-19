import axios from 'axios';

import { ArticleFormValues } from '@/shared/schemas';
import { ApiResponse } from '@/shared/types';

export async function createArticle(
  data: ArticleFormValues
): Promise<ApiResponse> {
  try {
    const respons = await axios.post<ApiResponse>('/api/posts', {
      data,
    });
    return respons.data;
  } catch (error) {
    console.error('createArticle: error:', error);
    throw new Error('Something went wrong, the article has not been created');
  }
}

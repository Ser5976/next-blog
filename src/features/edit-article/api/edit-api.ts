import axios from 'axios';

import { ArticleFormValues } from '@/shared/schemas';
import { ApiResponse } from '@/shared/types';

export async function updateArticle(
  articleId: string,
  data: ArticleFormValues
): Promise<ApiResponse> {
  try {
    const respons = await axios.put<ApiResponse>(`/api/posts/${articleId}`, {
      data,
    });
    return respons.data;
  } catch (error) {
    console.error('updateArticle: error:', error);
    throw error;
  }
}

import axios from 'axios';

import { ApiResponse } from '../model';

export async function deleteArticle(articleId: string): Promise<ApiResponse> {
  try {
    const { data } = await axios.delete<ApiResponse>(`/api/posts/${articleId}`);
    return data;
  } catch (error) {
    console.error('deleteArticle: error:', error);
    throw new Error('Something went wrong, the article was not deleted');
  }
}

export async function togglePublishArticle(
  articleId: string,
  published: boolean
): Promise<ApiResponse> {
  try {
    const { data } = await axios.patch<ApiResponse>(
      `/api/posts/${articleId}/publish`,
      { published }
    );
    return data;
  } catch (error) {
    console.error('togglePublishArticle: error:', error);
    throw new Error('Something went wrong, article status was not updated');
  }
}

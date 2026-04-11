import axios from 'axios';

import { ApiResponse, ArticleFormValues } from '../model';

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
    throw new Error('Something went wrong, the article has not been created');
  }
}

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

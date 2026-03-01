import axios from 'axios';

import { ApiResponse, ArticlesFilters, ArticlesResponse } from '../model';

export async function getArticles(
  filters: ArticlesFilters
): Promise<ArticlesResponse> {
  try {
    const { data } = await axios.get<ArticlesResponse>(
      '/api/dashboard/articles',
      { params: filters }
    );
    return data;
  } catch (error) {
    console.error('getArticles: error:', error);
    throw new Error('Something went wrong, articles were not received');
  }
}

export async function deleteArticle(articleId: string): Promise<ApiResponse> {
  try {
    const { data } = await axios.delete<ApiResponse>(
      `/api/dashboard/articles/${articleId}`
    );
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
      `/api/dashboard/articles/${articleId}`,
      { published }
    );
    return data;
  } catch (error) {
    console.error('togglePublishArticle: error:', error);
    throw new Error('Something went wrong, article status was not updated');
  }
}

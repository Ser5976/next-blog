import axios from 'axios';

import {
  ApiResponse,
  Article,
  ArticleFormValues,
  ArticlesFilters,
  ArticlesResponse,
} from '../model';

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

export async function createArticle(
  data: ArticleFormValues
): Promise<ArticlesResponse & { article?: Article }> {
  try {
    const respons = await axios.post<ArticlesResponse & { article?: Article }>(
      '/api/posts',
      {
        data,
      }
    );
    return respons.data;
  } catch (error) {
    console.error('createArticle: error:', error);
    throw new Error('Something went wrong, the article has not been created');
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

import axios from 'axios';

import { UserPostsResponse } from '../model';

// Функция для получения постов пользователя
export async function getUserPosts(userId: string): Promise<UserPostsResponse> {
  try {
    const { data } = await axios.get<UserPostsResponse>(
      `/api/dashboard/users/${userId}/posts`
    );

    return data;
  } catch (error) {
    console.error('getUserPosts: error:', error);
    throw new Error('Failed to fetch user posts');
  }
}

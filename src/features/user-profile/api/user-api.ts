import axios from 'axios';

import { UserPostsResponse, UserProfileResponse } from '../model';

export async function getUserProfile(
  userId: string
): Promise<UserProfileResponse> {
  try {
    const { data } = await axios.get<UserProfileResponse>(
      `/api/dashboard/users/${userId}`
    );
    return data;
  } catch (error) {
    console.error('getUserProfile: error:', error);
    throw new Error('Failed to fetch user profile');
  }
}

export async function getUserPosts(
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<UserPostsResponse> {
  try {
    const { data } = await axios.get<UserPostsResponse>(
      `/api/dashboard/users/${userId}/posts`,
      {
        params: { page, limit },
      }
    );
    return data;
  } catch (error) {
    console.error('getUserPosts: error:', error);
    throw new Error('Failed to fetch user posts');
  }
}

import axios from 'axios';

import { UserCommentsResponse } from '../model';

export async function getUserComments(
  userId: string
): Promise<UserCommentsResponse> {
  try {
    const { data } = await axios.get<UserCommentsResponse>(
      `/api/dashboard/users/${userId}/comments`
    );

    return data;
  } catch (error) {
    console.error('getUserComments: error:', error);
    throw new Error('Failed to fetch user comments');
  }
}

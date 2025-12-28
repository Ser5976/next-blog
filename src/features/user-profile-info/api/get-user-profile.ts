import axios from 'axios';

import { User } from '../model';

export async function getUserProfile(userId: string): Promise<User> {
  try {
    const { data } = await axios.get<User>(
      `/api/dashboard/users-clerk/${userId}`
    );
    return data;
  } catch (error) {
    console.error('getUserProfile: error:', error);
    throw new Error('Failed to fetch user profile');
  }
}

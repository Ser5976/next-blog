import axios from 'axios';

import { UserClerk } from '@/shared/types';

export async function getUserProfile(userId: string): Promise<UserClerk> {
  try {
    const { data } = await axios.get<UserClerk>(
      `/api/dashboard/users-clerk/${userId}`
    );
    return data;
  } catch (error) {
    console.error('getUserProfile: error:', error);
    throw new Error('Failed to fetch user profile');
  }
}

import axios from 'axios';

import { Tag } from '../model';

export async function getTags(): Promise<Tag[]> {
  try {
    const { data } = await axios.get<Tag[]>('/api/tags');
    return data;
  } catch (error) {
    console.error('getTags: error:', error);
    throw new Error('Failed to fetch tags');
  }
}

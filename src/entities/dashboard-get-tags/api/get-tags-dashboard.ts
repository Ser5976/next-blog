import axios from 'axios';

import { Tag } from '../model';

export async function getTagsDashboard(): Promise<Tag[]> {
  try {
    const { data } = await axios.get<Tag[]>('/api/tags');
    return data;
  } catch (error) {
    console.error('getTagsDashboard: error:', error);
    throw new Error('Something went wrong, tags were not received');
  }
}

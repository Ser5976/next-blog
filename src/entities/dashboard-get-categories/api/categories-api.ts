import axios from 'axios';

import { Category } from '../model';

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await axios.get<Category[]>('/api/categories');
    return data;
  } catch (error) {
    console.error('getCategories: error:', error);
    throw new Error('Failed to fetch categories');
  }
}

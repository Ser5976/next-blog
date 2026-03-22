import axios from 'axios';

import { Category } from '../model';

export async function getCategoriesDashboard(): Promise<Category[]> {
  try {
    const { data } = await axios.get<Category[]>('/api/categories');
    return data;
  } catch (error) {
    console.error('getCategoriesDashboard: error:', error);
    throw new Error('Something went wrong, categories were not received');
  }
}

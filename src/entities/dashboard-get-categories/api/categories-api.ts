import axios from 'axios';

import { Category, CategoryFormValues } from '../model';

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await axios.get<Category[]>('/api/categories');
    return data;
  } catch (error) {
    console.error('getCategories: error:', error);
    throw new Error('Failed to fetch categories');
  }
}

export async function getCategory(id: string): Promise<Category> {
  try {
    const { data } = await axios.get<{ success: boolean; category: Category }>(
      `/api/categories/${id}`
    );
    return data.category;
  } catch (error) {
    console.error('getCategory: error:', error);
    throw new Error('Failed to fetch category');
  }
}

export async function createCategory(
  data: CategoryFormValues
): Promise<Category> {
  try {
    const response = await axios.post<{ success: boolean; category: Category }>(
      '/api/categories',
      data
    );
    return response.data.category;
  } catch (error) {
    console.error('createCategory: error:', error);
    throw new Error('Failed to create category');
  }
}

export async function updateCategory(
  id: string,
  data: CategoryFormValues
): Promise<Category> {
  try {
    const response = await axios.put<{ success: boolean; category: Category }>(
      `/api/categories/${id}`,
      data
    );
    return response.data.category;
  } catch (error) {
    console.error('updateCategory: error:', error);
    throw new Error('Failed to update category');
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await axios.delete(`/api/categories/${id}`);
  } catch (error) {
    console.error('deleteCategory: error:', error);
    throw new Error('Failed to delete category');
  }
}

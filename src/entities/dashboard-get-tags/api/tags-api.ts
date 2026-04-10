import axios from 'axios';

import { Tag, TagFormValues } from '../model';

export async function getTags(): Promise<Tag[]> {
  try {
    const { data } = await axios.get<Tag[]>('/api/tags');
    return data;
  } catch (error) {
    console.error('getTags: error:', error);
    throw new Error('Failed to fetch tags');
  }
}

export async function getTag(id: string): Promise<Tag> {
  try {
    const { data } = await axios.get<{ success: boolean; tag: Tag }>(
      `/api/tags/${id}`
    );
    return data.tag;
  } catch (error) {
    console.error('getTag: error:', error);
    throw new Error('Failed to fetch tag');
  }
}

export async function createTag(data: TagFormValues): Promise<Tag> {
  try {
    const response = await axios.post<{ success: boolean; tag: Tag }>(
      '/api/tags',
      data
    );
    return response.data.tag;
  } catch (error) {
    console.error('createTag: error:', error);
    throw new Error('Failed to create tag');
  }
}

export async function updateTag(id: string, data: TagFormValues): Promise<Tag> {
  try {
    const response = await axios.put<{ success: boolean; tag: Tag }>(
      `/api/tags/${id}`,
      data
    );
    return response.data.tag;
  } catch (error) {
    console.error('updateTag: error:', error);
    throw new Error('Failed to update tag');
  }
}

export async function deleteTag(id: string): Promise<void> {
  try {
    await axios.delete(`/api/tags/${id}`);
  } catch (error) {
    console.error('deleteTag: error:', error);
    throw new Error('Failed to delete tag');
  }
}

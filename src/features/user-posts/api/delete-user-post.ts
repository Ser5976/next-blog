import axios from 'axios';

// Функция для получения постов пользователя
export async function deleteUserPost(
  postId: string
): Promise<{ message: string }> {
  try {
    const { data } = await axios.delete<{ message: string }>(
      `/api/posts/${postId}`
    );

    return data;
  } catch (error) {
    console.error('deleteUserPost: error:', error);
    throw new Error('Failed to delete user post');
  }
}

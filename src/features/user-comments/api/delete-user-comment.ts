import axios from 'axios';

import { DeleteCommentResponse } from '../model';

export async function deleteUserComment(
  commentId: string
): Promise<DeleteCommentResponse> {
  try {
    const { data } = await axios.delete<DeleteCommentResponse>(
      `/api/dashboard/comments/${commentId}`
    );

    return data;
  } catch (error) {
    console.error('deleteUserComment: error:', error);
    throw new Error('Failed to delete user comment');
  }
}

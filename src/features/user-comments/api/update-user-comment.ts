import axios from 'axios';

import { UpdateCommentResponse } from '../model';

export async function updateUserComment(
  commentId: string,
  content: string
): Promise<UpdateCommentResponse> {
  try {
    const { data } = await axios.patch<UpdateCommentResponse>(
      `/api/dashboard/comments/${commentId}`,
      { content }
    );

    return data;
  } catch (error) {
    console.error('updateUserComment: error:', error);
    throw new Error('Failed to update user comment');
  }
}

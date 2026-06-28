import axios from 'axios';

import { CommentFormValues } from '@/shared/schemas/comment-form-schemas';
import { Comment } from '../model/types';

export interface UpdateCommentData {
  content: string;
}

export async function updateComment(
  commentId: string,
  content: CommentFormValues
): Promise<Comment> {
  const response = await axios.patch<Comment>(
    `/api/dashboard/comments/${commentId}`,
    { content }
  );
  return response.data;
}

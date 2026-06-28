import axios from 'axios';

import { Comment } from '../model/types';

export interface CreateCommentData {
  content: string;
  postId: string;
}

export async function createComment(data: CreateCommentData): Promise<Comment> {
  const response = await axios.post<Comment>(
    `/api/posts/${data.postId}/comment`,
    { content: data.content }
  );
  return response.data;
}

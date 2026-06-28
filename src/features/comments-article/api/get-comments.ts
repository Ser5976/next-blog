import axios from 'axios';

import { CommentsResponse } from '../model/types';

export async function getComments(
  postId: string,
  page: number = 1,
  limit: number = 2
): Promise<CommentsResponse> {
  const { data } = await axios.get<CommentsResponse>(
    `/api/posts/${postId}/comments?page=${page}&limit=${limit}`
  );
  return data;
}

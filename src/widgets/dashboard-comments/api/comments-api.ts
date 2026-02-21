import axios from 'axios';

import {
  ApiResponse,
  CommentsFilters,
  CommentsResponse,
  UpdateCommentParams,
} from '../model';

export async function getComments(
  filters: CommentsFilters
): Promise<CommentsResponse> {
  try {
    const { data } = await axios.get<CommentsResponse>(
      '/api/dashboard/comments',
      { params: filters }
    );
    return data;
  } catch (error) {
    console.error('getComments: error:', error);
    throw new Error('Something went wrong, comments were not received');
  }
}

export async function updateComment(
  params: UpdateCommentParams
): Promise<ApiResponse> {
  try {
    const { data } = await axios.patch<ApiResponse>(
      `/api/dashboard/comments/${params.commentId}`,
      { content: params.content }
    );

    return data;
  } catch (error) {
    console.error('updateComment: error:', error);
    throw new Error('Something went wrong, the comment was not updated');
  }
}

export async function deleteComment(commentId: string): Promise<ApiResponse> {
  try {
    const { data } = await axios.delete<ApiResponse>(
      `/api/dashboard/comments/${commentId}`
    );
    return data;
  } catch (error) {
    console.error('deleteComment: error:', error);
    throw new Error('Something went wrong, the comment was not deleted');
  }
}

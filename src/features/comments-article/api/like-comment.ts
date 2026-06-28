import axios from 'axios';

export async function likeComment(commentId: string): Promise<void> {
  const response = await axios.post(
    `/api/dashboard/comments/${commentId}/like`
  );
  return response.data;
}

export async function dislikeComment(commentId: string): Promise<void> {
  const response = await axios.post(
    `/api/dashboard/comments/${commentId}/dislike`
  );
  return response.data;
}
export async function removeReaction(commentId: string) {
  const response = await axios.delete(
    `/api/dashboard/comments/${commentId}/dislike`
  );
  return response.data;
}

import axios from 'axios';

export async function deleteComment(commentId: string): Promise<void> {
  await axios.delete(`/api/dashboard/comments/${commentId}`);
}

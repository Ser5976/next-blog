import axios from 'axios';

import { RatePostResponse } from '../model';

export async function ratePost(
  postId: string,
  rating: number
): Promise<RatePostResponse> {
  const { data } = await axios.post<RatePostResponse>(
    `/api/posts/${postId}/rate`,
    {
      rating,
    }
  );
  return data;
}

export async function getUserRating(postId: string): Promise<number | null> {
  try {
    const { data } = await axios.get<{ rating: number | null }>(
      `/api/posts/${postId}/user-rating`
    );
    return data.rating;
  } catch {
    return null;
  }
}

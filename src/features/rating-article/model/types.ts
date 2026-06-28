export interface RatePostResponse {
  success: boolean;
  averageRating: number;
  ratingCount: number;
  userRating: number;
}

export interface RatingArticleProps {
  postId: string;
  currentRating: number | null;
  ratingCount: number;
}

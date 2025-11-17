export interface IRatingStats {
  averageRating: { current: number; previous: number; change: number };
  totalRatings: { current: number; previous: number; change: number };
}

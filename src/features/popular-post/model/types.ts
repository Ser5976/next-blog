export interface IPopularPosts {
  id: string;
  title: string;
  views: number;
  rating: number;
  commentCount: number;
  published: boolean;
  publishedAt: Date | null;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  published: boolean;
  viewCount: number;
  averageRating?: number | null;
  ratingCount: number;
  createdAt: Date | string;
  publishedAt?: Date | string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
  }>;
  stats: {
    commentsCount: number;
  };
}

export interface PostRowProps {
  post: Post;
  onDelete: (postId: string) => void;
  isDeleting?: boolean;
}

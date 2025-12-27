export interface UserProfile {
  id: string;
  clerkId: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  imageUrl?: string | null;
  role: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  lastSignInAt?: string | Date | null;
  _count?: {
    posts: number;
    comments: number;
    ratings: number;
    likes: number;
    dislikes: number;
  };
}

export interface UserPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  published: boolean;
  viewCount: number;
  averageRating?: number | null;
  ratingCount: number;
  createdAt: string | Date;
  publishedAt?: string | Date | null;
  category?: {
    id: string;
    name: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
  }>;
}

export interface UserPostsResponse {
  posts: UserPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  success: boolean;
  message?: string;
}

export interface UserProfileResponse {
  success: boolean;
  user: UserProfile;
  message?: string;
}

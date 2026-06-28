export interface CommentAuthor {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string | null;
  postId: string;
  createdAt: string;
  updatedAt: string;
  author: CommentAuthor | null;
  likesCount: number;
  dislikesCount: number;
  userReaction?: 'like' | 'dislike' | null;
  post?: {
    id: string;
    title: string;
    slug: string;
  };
  isAuthor: boolean;
}

export interface CommentsResponse {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

export interface CommentsArticleProps {
  postId: string;
  postSlug: string;
  initialCommentsCount?: number;
}

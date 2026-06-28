export const commentsQueryKeys = {
  all: ['comments'] as const,
  post: (postId: string, page: number, limit: number) =>
    [...commentsQueryKeys.all, 'post', postId, page, limit] as const,
  user: (userId: string) => [...commentsQueryKeys.all, 'user', userId] as const,
  infinite: (postId: string) => ['comments', postId] as const, // Исправлено: теперь совпадает с useInfiniteComments
};

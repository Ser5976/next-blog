export const userPostsQueryKeys = {
  all: ['user-posts'] as const,
  list: (userId: string) =>
    [...userPostsQueryKeys.all, 'list', userId] as const,
  stats: (userId: string) =>
    [...userPostsQueryKeys.all, 'stats', userId] as const,
} as const;

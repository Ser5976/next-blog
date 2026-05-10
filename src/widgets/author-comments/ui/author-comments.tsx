import { UserCommentsList } from '@/features/user-comments';

export const AuthorComments = ({ userId }: { userId: string }) => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Comments</h1>
          <p className="text-muted-foreground mt-1">
            Review, edit, and remove your comments
          </p>
        </div>
        <UserCommentsList userId={userId} />
      </div>
    </div>
  );
};

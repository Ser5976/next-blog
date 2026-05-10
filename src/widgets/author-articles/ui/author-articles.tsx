'use client';

import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { UserPostsList } from '@/features/user-posts';
import { Button } from '@/shared/ui';

export const AuthorArticles = ({ userId }: { userId: string }) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Articles</h1>
            <p className="text-muted-foreground mt-1">
              Manage your articles and drafts
            </p>
          </div>
          <Button
            size="sm"
            className="gap-2 cursor-pointer"
            onClick={() => router.push('/create-article')}
          >
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </div>
        <UserPostsList userId={userId} />
      </div>
    </div>
  );
};

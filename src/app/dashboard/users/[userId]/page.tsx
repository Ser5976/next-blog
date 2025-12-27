'use client';

import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { UserProfile } from '@/features/user-profile/ui';

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  if (!userId) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <UserProfile userId={userId} />
      </div>
    </div>
  );
}

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { UserProfileInfo } from '@/features/user-profile-info';
import { Button, Subtitle, Title } from '@/shared/ui';
import { DASHBOARD_HEADER } from '../lib';
import { UserContent } from './user-content';

export const UserProfile = ({ userId }: { userId: string }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/users">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div>
            <Title>{DASHBOARD_HEADER.title}</Title>
            <Subtitle>{DASHBOARD_HEADER.subtitle}</Subtitle>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <UserProfileInfo userId={userId} />
        {/* Right Column - Content */}
        <UserContent userId={userId} />
      </div>
    </div>
  );
};

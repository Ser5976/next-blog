//import { UserProfile } from '@/features/user-profile/ui';

import { UserProfile } from '@/widgets/dashboard-user-profile';

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <UserProfile userId={userId} />
      </div>
    </div>
  );
}

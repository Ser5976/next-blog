'use client';

import Image from 'next/image';
import { Hash, Mail, User, UserCog } from 'lucide-react';

import { formatDate } from '@/shared/lib';
import { ListSkeleton, UniversalError } from '@/shared/ui';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import { useUserProfile } from '../hooks';
import { getFullName } from '../lib';
import { getRoleInfo } from '../lib/helper-functions';

export function UserProfileInfo({ userId }: { userId: string }) {
  const {
    data,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
    error: profileError,
  } = useUserProfile(userId);

  const user = data ?? {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    imageUrl: '',
    createdAt: null,
    lastSignInAt: null,
  };
  if (isLoadingProfile) {
    return <ListSkeleton count={1} itemClassName="h-[550px]" />;
  }

  if (isErrorProfile) {
    return (
      <UniversalError
        error={profileError}
        icon={<UserCog className="h-12 w-12 mx-auto text-red-500" />}
        title="User not found"
      />
    );
  }

  const roleInfo = getRoleInfo(user.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="lg:col-span-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={getFullName(user)}
                  width={120}
                  height={120}
                  className="h-30 w-30 rounded-full border-2 border-border object-cover"
                />
              ) : (
                <div className="h-30 w-30 rounded-full bg-gradient-to-br from-muted to-muted/70 border-2 border-border flex items-center justify-center">
                  <User className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{getFullName(user)}</h2>
              <Badge className={`mt-2 ${roleInfo.color}`}>
                <RoleIcon className="h-3 w-3 mr-1" />
                {roleInfo.label}
              </Badge>
            </div>
          </div>
          <Separator />
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono truncate">{user?.id}</span>
              </div>
            </div>
          </div>
          <Separator />
          {/* Dates */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Account Dates
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Joined</span>
                <span className="text-sm font-medium">
                  {formatDate(user.createdAt)}
                </span>
              </div>

              {user.lastSignInAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Sign In
                  </span>
                  <span className="text-sm font-medium">
                    {formatDate(user.lastSignInAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

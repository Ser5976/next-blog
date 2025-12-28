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
    return (
      <div
        data-testid="user-profile-info-loading"
        aria-label="Loading user profile"
        aria-busy="true"
      >
        <ListSkeleton count={1} itemClassName="h-[550px]" />
      </div>
    );
  }

  if (isErrorProfile) {
    return (
      <div
        data-testid="user-profile-info-error"
        aria-label="User profile error"
        role="alert"
      >
        <UniversalError
          error={profileError}
          icon={<UserCog className="h-12 w-12 mx-auto text-red-500" />}
          title="User not found"
        />
      </div>
    );
  }

  const roleInfo = getRoleInfo(user.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div
      className="lg:col-span-1 space-y-6"
      data-testid="user-profile-info"
      aria-label="User profile information"
    >
      <Card data-testid="profile-info-card">
        <CardHeader>
          <CardTitle
            className="flex items-center gap-2"
            data-testid="profile-info-title"
          >
            <User className="h-5 w-5" aria-hidden="true" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar & Name */}
          <div
            className="flex flex-col items-center text-center space-y-4"
            data-testid="avatar-name-section"
            aria-label="Avatar and name"
          >
            <div className="relative">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={getFullName(user)}
                  width={120}
                  height={120}
                  className="h-30 w-30 rounded-full border-2 border-border object-cover"
                  data-testid="user-avatar"
                  aria-label={`Avatar of ${getFullName(user)}`}
                />
              ) : (
                <div
                  className="h-30 w-30 rounded-full bg-gradient-to-br from-muted to-muted/70 border-2 border-border flex items-center justify-center"
                  data-testid="user-avatar-placeholder"
                  aria-label="Default avatar placeholder"
                >
                  <User
                    className="h-16 w-16 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
            <div>
              <h2
                className="text-2xl font-bold"
                data-testid="user-full-name"
                aria-label={`User name: ${getFullName(user)}`}
              >
                {getFullName(user)}
              </h2>
              <Badge
                className={`mt-2 ${roleInfo.color}`}
                data-testid="user-role-badge"
                aria-label={`User role: ${roleInfo.label}`}
              >
                <RoleIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                {roleInfo.label}
              </Badge>
            </div>
          </div>

          <Separator data-testid="separator-1" aria-orientation="horizontal" />

          {/* Contact Info */}
          <div
            className="space-y-3"
            data-testid="contact-info-section"
            aria-label="Contact information"
          >
            <h3
              className="font-semibold text-sm text-muted-foreground uppercase tracking-wider"
              data-testid="contact-info-title"
            >
              Contact Information
            </h3>
            <div className="space-y-2">
              <div
                className="flex items-center gap-2"
                data-testid="email-info"
                aria-label={`Email: ${user?.email}`}
              >
                <Mail
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <span className="text-sm truncate" data-testid="user-email">
                  {user?.email}
                </span>
              </div>
              <div
                className="flex items-center gap-2"
                data-testid="user-id-info"
                aria-label={`User ID: ${user?.id}`}
              >
                <Hash
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <span
                  className="text-sm font-mono truncate"
                  data-testid="user-id"
                >
                  {user?.id}
                </span>
              </div>
            </div>
          </div>

          <Separator data-testid="separator-2" aria-orientation="horizontal" />

          {/* Dates */}
          <div
            className="space-y-3"
            data-testid="dates-section"
            aria-label="Account dates"
          >
            <h3
              className="font-semibold text-sm text-muted-foreground uppercase tracking-wider"
              data-testid="dates-title"
            >
              Account Dates
            </h3>
            <div className="space-y-2">
              <div
                className="flex items-center justify-between"
                data-testid="joined-date"
                aria-label={`Joined date: ${formatDate(user.createdAt)}`}
              >
                <span className="text-sm text-muted-foreground">Joined</span>
                <span
                  className="text-sm font-medium"
                  data-testid="joined-date-value"
                >
                  {formatDate(user.createdAt)}
                </span>
              </div>

              {user.lastSignInAt && (
                <div
                  className="flex items-center justify-between"
                  data-testid="last-signin-date"
                  aria-label={`Last sign in date: ${formatDate(user.lastSignInAt)}`}
                >
                  <span className="text-sm text-muted-foreground">
                    Last Sign In
                  </span>
                  <span
                    className="text-sm font-medium"
                    data-testid="last-signin-date-value"
                  >
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

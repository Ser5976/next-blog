'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Clock,
  Edit,
  Eye,
  FileText,
  Globe,
  Hash,
  Loader2,
  Mail,
  Package,
  PenTool,
  Shield,
  Star,
  User,
  UserCog,
} from 'lucide-react';
import { toast } from 'sonner';

import { formatDateDay, formatDateTime } from '@/shared/lib';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useUserPosts, useUserProfile } from '../hooks';

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('posts');
  // const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(10);

  const {
    data: profileData,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useUserProfile(userId);

  const {
    data: postsData,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
    //error: postsError,
    refetch: refetchPosts,
  } = useUserPosts(userId);

  const handleRefresh = () => {
    refetchProfile();
    if (activeTab === 'posts') {
      refetchPosts();
    }
    toast.success('Data refreshed');
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading profile...</span>
      </div>
    );
  }

  if (isErrorProfile || !profileData?.success) {
    return (
      <div className="text-center py-12">
        <UserCog className="h-12 w-12 mx-auto text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">User not found</h2>
        <p className="mt-2 text-muted-foreground">
          {profileError?.message || 'Failed to load user profile'}
        </p>
        <Button
          onClick={() => router.push('/dashboard/users')}
          className="mt-4"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>
    );
  }

  const { user } = profileData;

  const getFullName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.lastName) return user.lastName;
    return user.email.split('@')[0];
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          icon: Shield,
          color: 'bg-red-100 text-red-800 border-red-200',
          label: 'Administrator',
        };
      case 'author':
        return {
          icon: PenTool,
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'Author',
        };
      default:
        return {
          icon: User,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'User',
        };
    }
  };

  const roleInfo = getRoleInfo(user.role);
  const RoleIcon = roleInfo.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push('/dashboard/users')}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
            <p className="text-muted-foreground mt-1">
              View and manage user details
            </p>
          </div>
        </div>

        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoadingProfile || isLoadingPosts}
          className="gap-2"
        >
          {isLoadingProfile || isLoadingPosts ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Refresh'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
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
                      alt={getFullName()}
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
                  <h2 className="text-2xl font-bold">{getFullName()}</h2>
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
                    <span className="text-sm truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-mono truncate">
                      {user.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-mono truncate">
                      {user.clerkId}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Activity Stats */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Activity Stats
                </h3>
                {user._count && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="font-bold text-2xl">
                        {user._count.posts}
                      </div>
                      <div className="text-xs text-muted-foreground">Posts</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="font-bold text-2xl">
                        {user._count.comments}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Comments
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="font-bold text-2xl">
                        {user._count.ratings}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Ratings
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <div className="font-bold text-2xl">
                        {(user._count.likes || 0) + (user._count.dislikes || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Reactions
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Dates */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Account Dates
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Joined
                    </span>
                    <span className="text-sm font-medium">
                      {formatDateTime(user.createdAt.toString())}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Last Updated
                    </span>
                    <span className="text-sm font-medium">
                      {formatDateTime(user.updatedAt.toString())}
                    </span>
                  </div>
                  {user.lastSignInAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last Sign In
                      </span>
                      <span className="text-sm font-medium">
                        {formatDateTime(user.lastSignInAt.toString())}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  User Content
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="posts"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Posts ({postsData?.posts.length || 0})
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Activity
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="mt-6">
                  {isLoadingPosts ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">
                        Loading posts...
                      </span>
                    </div>
                  ) : isErrorPosts ? (
                    <div className="text-center py-8">
                      <p className="text-destructive">Failed to load posts</p>
                      <Button
                        onClick={() => refetchPosts()}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : !postsData?.posts?.length ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                      <h3 className="mt-4 font-semibold">No posts yet</h3>
                      <p className="text-muted-foreground mt-2">
                        This user hasnt created any posts.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Views</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {postsData.posts.map((post) => (
                            <TableRow key={post.id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {post.coverImage ? (
                                    <Image
                                      src={post.coverImage}
                                      alt={post.title}
                                      width={40}
                                      height={40}
                                      className="rounded-md object-cover"
                                    />
                                  ) : (
                                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                      <FileText className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-medium line-clamp-1">
                                      {post.title}
                                    </div>
                                    {post.excerpt && (
                                      <div className="text-sm text-muted-foreground line-clamp-1">
                                        {post.excerpt}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    post.published ? 'default' : 'secondary'
                                  }
                                >
                                  {post.published ? 'Published' : 'Draft'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {post.category ? (
                                  <Badge variant="outline">
                                    {post.category.name}
                                  </Badge>
                                ) : (
                                  <span className="text-muted-foreground text-sm">
                                    —
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3 text-muted-foreground" />
                                  {post.viewCount.toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                {post.ratingCount > 0 && post.averageRating ? (
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                    <span>{post.averageRating.toFixed(1)}</span>
                                    <span className="text-muted-foreground text-xs">
                                      ({post.ratingCount})
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-sm">
                                    —
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {post.publishedAt ? (
                                  <div className="text-sm">
                                    {formatDateDay(post.publishedAt.toString())}
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground text-sm">
                                    —
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="h-8 w-8 p-0"
                                  >
                                    <Link
                                      href={`/posts/${post.slug}`}
                                      target="_blank"
                                    >
                                      <Globe className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    asChild
                                  >
                                    <Link
                                      href={`/dashboard/posts/${post.id}/edit`}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 font-semibold">Activity Log</h3>
                    <p className="text-muted-foreground mt-2">
                      User activity log will be displayed here.
                    </p>
                    <Button className="mt-4" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

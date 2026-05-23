import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';
import { calculateChange, getDateFilter } from '@/shared/lib';

type AuthorStats = {
  posts: number;
  publishedPosts: number;
  comments: number;
  totalViews: number;
};

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId, sessionClaims } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    const role = sessionClaims?.metadata?.role as string | undefined;
    if (role !== 'author' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient rights to view author stats' },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({
        current: { posts: 0, publishedPosts: 0, comments: 0, totalViews: 0 },
        previous: { posts: 0, publishedPosts: 0, comments: 0, totalViews: 0 },
        changes: { posts: 0, publishedPosts: 0, comments: 0, totalViews: 0 },
      });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') as
      | 'week'
      | 'month'
      | 'year'
      | null;

    const [current, previous] = await Promise.all([
      getAuthorStats(user.id, timeRange, false),
      getAuthorStats(user.id, timeRange, true),
    ]);

    return NextResponse.json({
      current,
      previous,
      changes: {
        posts: calculateChange(current.posts, previous.posts),
        publishedPosts: calculateChange(
          current.publishedPosts,
          previous.publishedPosts
        ),
        comments: calculateChange(current.comments, previous.comments),
        totalViews: calculateChange(current.totalViews, previous.totalViews),
      },
    });
  } catch (error) {
    console.error('Author stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to load author statistics' },
      { status: 500 }
    );
  }
}

async function getAuthorStats(
  userId: string,
  timeRange: string | null,
  isPreviousPeriod: boolean
): Promise<AuthorStats> {
  const dateFilter = getDateFilter(timeRange, isPreviousPeriod);
  const postWhere = dateFilter
    ? { authorId: userId, createdAt: dateFilter }
    : { authorId: userId };
  const commentWhere = dateFilter
    ? { authorId: userId, createdAt: dateFilter }
    : { authorId: userId };

  const [posts, publishedPosts, comments, viewStats] = await Promise.all([
    prisma.post.count({ where: postWhere }),
    prisma.post.count({ where: { ...postWhere, published: true } }),
    prisma.comment.count({ where: commentWhere }),
    prisma.post.aggregate({
      where: postWhere,
      _sum: { viewCount: true },
    }),
  ]);

  return {
    posts,
    publishedPosts,
    comments,
    totalViews: viewStats._sum.viewCount || 0,
  };
}

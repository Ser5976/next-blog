import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/shared/api';
import { getDateFilter } from '@/shared/lib';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') as
      | 'week'
      | 'month'
      | 'year'
      | null;

    const dateFilter = getDateFilter(timeRange);

    const posts = await prisma.post.findMany({
      where: dateFilter ? { createdAt: dateFilter } : {},
      select: {
        id: true,
        title: true,
        viewCount: true,
        averageRating: true,
        published: true,
        publishedAt: true,
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        viewCount: 'desc',
      },
      take: 3,
    });

    const popularPosts = posts.map((post) => ({
      id: post.id,
      title: post.title,
      views: post.viewCount,
      rating: post.averageRating || 0,
      commentCount: post._count.comments,
      published: post.published,
      publishedAt: post.publishedAt,
    }));

    return NextResponse.json(popularPosts);
  } catch (error) {
    console.error('Popular posts error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

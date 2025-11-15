import { NextResponse } from 'next/server';

import { prisma } from '@/shared/api';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        posts: {
          select: {
            viewCount: true,
          },
        },
      },
    });

    const categoryStats = categories
      .map((category) => ({
        name: category.name,
        postCount: category.posts.length,
        totalViews: category.posts.reduce(
          (sum, post) => sum + post.viewCount,
          0
        ),
      }))
      .sort((a, b) => b.totalViews - a.totalViews);

    return NextResponse.json(categoryStats);
  } catch (error) {
    console.error('Categories stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

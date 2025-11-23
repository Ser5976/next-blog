import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/shared/api';
import { getDateFilter } from '@/shared/lib';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange') as
    | 'week'
    | 'month'
    | 'year'
    | null;

  const dateFilter = getDateFilter(timeRange);
  try {
    const categories = await prisma.category.findMany({
      include: {
        posts: {
          where: dateFilter ? { createdAt: dateFilter } : {},
          select: {
            viewCount: true,
            createdAt: true, // для отладки
          },
        },
      },
    });

    // Вычисляем общее количество просмотров во всех категориях
    const totalViewsAllCategories = categories.reduce(
      (sum, category) =>
        sum +
        category.posts.reduce((catSum, post) => catSum + post.viewCount, 0),
      0
    );

    const categoryStats = categories
      .map((category) => {
        const categoryTotalViews = category.posts.reduce(
          (sum, post) => sum + post.viewCount,
          0
        );

        // Вычисляем процент просмотров для этой категории
        const viewsPercentage =
          totalViewsAllCategories > 0
            ? (categoryTotalViews / totalViewsAllCategories) * 100
            : 0;

        return {
          name: category.name,
          postCount: category.posts.length,
          totalViews: categoryTotalViews,
          viewsPercentage: parseFloat(viewsPercentage.toFixed(2)), // Округляем до 2 знаков
        };
      })
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

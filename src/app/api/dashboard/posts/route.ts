import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/shared/api';
import { calculateChanges, getDateFilter } from '@/shared/lib';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') as
      | 'week'
      | 'month'
      | 'year'
      | null;

    // Получаем данные за текущий и предыдущий период
    const [currentStats, previousStats] = await Promise.all([
      getPostsStats(timeRange, false), // Текущий период
      getPostsStats(timeRange, true), // Предыдущий период
    ]);

    const changes = calculateChanges(currentStats, previousStats);

    return NextResponse.json({
      totalPosts: {
        current: currentStats.totalPosts,
        previous: previousStats.totalPosts,
        change: changes.totalPosts,
      },
      publishedPosts: {
        current: currentStats.publishedPosts,
        previous: previousStats.publishedPosts,
        change: changes.publishedPosts,
      },
    });
  } catch (error) {
    console.error('Posts stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getPostsStats(
  timeRange: string | null,
  isPreviousPeriod: boolean = false
) {
  const dateFilter = getDateFilter(timeRange, isPreviousPeriod);
  /*  console.log(
    `фильтр для ${timeRange} (предыдущий: ${isPreviousPeriod}):`,
    dateFilter
  ); */
  const whereClause = dateFilter ? { createdAt: dateFilter } : {};

  const [totalPosts, publishedPosts] = await Promise.all([
    prisma.post.count({ where: whereClause }),
    prisma.post.count({
      where: { ...whereClause, published: true },
    }),
  ]);

  return {
    totalPosts,
    publishedPosts,
  };
}

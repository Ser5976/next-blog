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
      totalViews: {
        current: currentStats.totalViews,
        previous: previousStats.totalViews,
        change: changes.totalViews,
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
  const whereClause = dateFilter ? { createdAt: dateFilter } : {};
  /* console.log(
    `фильтр для ${timeRange} (предыдущий: ${isPreviousPeriod}):`,
    dateFilter
  ); */

  const postsWithViews = await prisma.post.findMany({
    where: whereClause,
    select: { viewCount: true },
  });

  const totalViews = postsWithViews.reduce(
    (sum, post) => sum + post.viewCount,
    0
  );

  return {
    totalViews,
  };
}

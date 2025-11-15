import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/shared/api';
import {
  calculateChanges,
  getDateFilter,
  getPreviousPeriod,
} from '@/shared/lib';

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
      getPostsStats(timeRange),
      getPostsStats(getPreviousPeriod(timeRange)),
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

async function getPostsStats(timeRange: string | null) {
  const dateFilter = getDateFilter(timeRange);
  const whereClause = dateFilter ? { createdAt: dateFilter } : {};

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

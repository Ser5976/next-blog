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

    const [currentStats, previousStats] = await Promise.all([
      getRatingsStats(timeRange),
      getRatingsStats(getPreviousPeriod(timeRange)),
    ]);

    const changes = calculateChanges(currentStats, previousStats);

    return NextResponse.json({
      averageRating: {
        current: Number(currentStats.averageRating.toFixed(1)),
        previous: Number(previousStats.averageRating.toFixed(1)),
        change: changes.averageRating,
      },
      totalRatings: {
        current: currentStats.totalRatings,
        previous: previousStats.totalRatings,
        change: changes.totalRatings,
      },
    });
  } catch (error) {
    console.error('Ratings stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getRatingsStats(timeRange: string | null) {
  const dateFilter = getDateFilter(timeRange);
  const whereClause = dateFilter ? { post: { createdAt: dateFilter } } : {};

  const ratings = await prisma.rating.findMany({
    where: whereClause,
    select: { value: true },
  });

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
      : 0;

  return {
    averageRating,
    totalRatings: ratings.length,
  };
}

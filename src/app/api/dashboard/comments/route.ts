import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/shared/api';
import {
  calculateChange,
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
      getCommentsStats(timeRange),
      getCommentsStats(getPreviousPeriod(timeRange)),
    ]);

    const change = calculateChange(
      currentStats.totalComments,
      previousStats.totalComments
    );

    return NextResponse.json({
      totalComments: {
        current: currentStats.totalComments,
        previous: previousStats.totalComments,
        change: change,
      },
    });
  } catch (error) {
    console.error('Comments stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getCommentsStats(timeRange: string | null) {
  const dateFilter = getDateFilter(timeRange);
  const whereClause = dateFilter ? { post: { createdAt: dateFilter } } : {};

  const totalComments = await prisma.comment.count({
    where: whereClause,
  });

  return {
    totalComments,
  };
}

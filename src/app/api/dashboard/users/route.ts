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
    console.log('timeRage!!!!!!:', timeRange);
    const [currentStats, previousStats] = await Promise.all([
      getUsersStats(timeRange),
      getUsersStats(getPreviousPeriod(timeRange)),
    ]);

    const change = calculateChange(
      currentStats.totalUsers,
      previousStats.totalUsers
    );

    return NextResponse.json({
      totalUsers: {
        current: currentStats.totalUsers,
        previous: previousStats.totalUsers,
        change: change,
      },
    });
  } catch (error) {
    console.error('Users stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getUsersStats(timeRange: string | null) {
  const dateFilter = getDateFilter(timeRange);
  console.log(`проверка ${timeRange}:`, dateFilter);
  const whereClause = dateFilter ? { createdAt: dateFilter } : {};

  const totalUsers = await prisma.user.count({
    where: whereClause,
  });

  return {
    totalUsers,
  };
}

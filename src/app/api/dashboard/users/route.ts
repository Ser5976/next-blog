import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/shared/api';
import { calculateChange, getDateFilter } from '@/shared/lib';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') as
      | 'week'
      | 'month'
      | 'year'
      | null;

    const [currentStats, previousStats] = await Promise.all([
      getUsersStats(timeRange, false), // Текущий период
      getUsersStats(timeRange, true), // Предыдущий период
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

async function getUsersStats(
  timeRange: string | null,
  isPreviousPeriod: boolean = false
) {
  const dateFilter = getDateFilter(timeRange, isPreviousPeriod);
  console.log(
    `фильтр для ${timeRange} (предыдущий: ${isPreviousPeriod}):`,
    dateFilter
  );

  const whereClause = dateFilter
    ? {
        createdAt: dateFilter,
      }
    : {};

  const totalUsers = await prisma.user.count({
    where: whereClause,
  });

  return {
    totalUsers,
  };
}

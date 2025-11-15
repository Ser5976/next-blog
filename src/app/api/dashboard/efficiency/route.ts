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

    // Получаем данные за текущий и предыдущий период
    const [currentStats, previousStats] = await Promise.all([
      getEfficiencyStats(timeRange),
      getEfficiencyStats(getPreviousPeriod(timeRange)),
    ]);

    const change = calculateChange(
      currentStats.efficiency,
      previousStats.efficiency
    );

    return NextResponse.json({
      efficiency: {
        current: currentStats.efficiency,
        previous: previousStats.efficiency,
        change: change,
      },
      publishedRatio: {
        current: currentStats.publishedRatio,
        previous: previousStats.publishedRatio,
      },
      totalPosts: currentStats.totalPosts,
      publishedPosts: currentStats.publishedPosts,
    });
  } catch (error) {
    console.error('Efficiency stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getEfficiencyStats(timeRange: string | null) {
  const dateFilter = getDateFilter(timeRange);
  const whereClause = dateFilter ? { createdAt: dateFilter } : {};

  const [totalPosts, publishedPosts] = await Promise.all([
    prisma.post.count({ where: whereClause }),
    prisma.post.count({
      where: { ...whereClause, published: true },
    }),
  ]);

  // Эффективность = процент опубликованных статей
  const efficiency = totalPosts > 0 ? (publishedPosts / totalPosts) * 100 : 0;
  const publishedRatio = `${publishedPosts}/${totalPosts}`;

  return {
    efficiency: Number(efficiency.toFixed(0)), // Округляем до целого числа
    publishedRatio,
    totalPosts,
    publishedPosts,
  };
}

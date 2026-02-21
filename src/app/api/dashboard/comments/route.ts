import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/shared/api';
import { calculateChange, getDateFilter } from '@/shared/lib';
import { getCommentsAction } from '@/widgets/dashboard-comments/api';
import { CommentsFilters } from '@/widgets/dashboard-comments/model';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') as
      | 'week'
      | 'month'
      | 'year'
      | null;

    // Если есть параметр timeRange - возвращаем статистику (для dashboard-overview)
    if (timeRange) {
      const [currentStats, previousStats] = await Promise.all([
        getCommentsStats(timeRange, false),
        getCommentsStats(timeRange, true),
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
    }

    // Если есть параметр page - возвращаем список комментариев (для dashboard-comments)
    const page = searchParams.get('page');
    if (page) {
      const filters: CommentsFilters = {
        page: Number(page) || 1,
        limit: Number(searchParams.get('limit')) || 10,
        search: searchParams.get('search') || undefined,
      };

      const result = await getCommentsAction(filters);

      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }

      return NextResponse.json(result);
    }

    // По умолчанию возвращаем статистику (для обратной совместимости)
    const [currentStats, previousStats] = await Promise.all([
      getCommentsStats(null, false),
      getCommentsStats(null, true),
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
    console.error('Comments API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getCommentsStats(
  timeRange: string | null,
  isPreviousPeriod: boolean = false
) {
  const dateFilter = getDateFilter(timeRange, isPreviousPeriod);
  // console.log(
  //   `фильтр для ${timeRange} (предыдущий: ${isPreviousPeriod}):`,
  //   dateFilter
  // );
  const whereClause = dateFilter ? { post: { createdAt: dateFilter } } : {};

  const totalComments = await prisma.comment.count({
    where: whereClause,
  });

  return {
    totalComments,
  };
}

import { NextRequest, NextResponse } from 'next/server';

import {
  getUsersClerk,
  updateUserRoleClerk,
} from '@/widgets/dashboard-users/api';
import { UsersFilters } from '@/widgets/dashboard-users/model';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: UsersFilters = {
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      emailSearch: searchParams.get('emailSearch') || undefined,
    };

    // Валидация параметров
    if (filters.page && filters.page < 1) {
      return NextResponse.json(
        { error: 'Page must be greater than 0' },
        { status: 400 }
      );
    }

    if (filters.limit && (filters.limit < 1 || filters.limit > 100)) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    const result = await getUsersClerk(filters);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    // Кэширование на 30 секунд
    const headers = {
      'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
    };

    return NextResponse.json(result, { headers });
  } catch (error) {
    console.error('GET /api/users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const { data } = body;

    // Валидация тела запроса
    if (!data.userId || !data.newRole) {
      console.log('❌ Validation failed: missing userId or newRole');
      return NextResponse.json(
        { error: 'userId and newRole are required' },
        { status: 400 }
      );
    }

    const validRoles = ['user', 'author', 'admin'];
    if (!validRoles.includes(data.newRole)) {
      console.log('❌ Invalid role:', data.newRole);
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    const result = await updateUserRoleClerk({
      userId: data.userId,
      newRole: data.newRole,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('PATCH /api/users/role error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

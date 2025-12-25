import { NextRequest, NextResponse } from 'next/server';

import {
  getUsersClerk,
  updateUserRoleClerk,
} from '@/widgets/dashboard-users/api';
import { UsersFilters } from '@/widgets/dashboard-users/model';
import {
  updateRoleSchema,
  usersFiltersSchema,
} from '@/widgets/dashboard-users/model/validation-schemes';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: UsersFilters = {
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      emailSearch: searchParams.get('emailSearch') || undefined,
    };

    // валидация body при помощи zod
    // валидация при помощи zod
    const validation = usersFiltersSchema.safeParse(filters);
    //console.log('GET validation:', validation);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          message: validation.error.message,
        },
        { status: 400 }
      );
    }

    const result = await getUsersClerk(validation.data);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
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

    // валидация body при помощи zod
    const validation = updateRoleSchema.safeParse(data);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          message: validation.error.message,
        },
        { status: 400 }
      );
    }

    const result = await updateUserRoleClerk({
      userId: validation.data.userId,
      newRole: validation.data.newRole,
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

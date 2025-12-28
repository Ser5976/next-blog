import { NextRequest, NextResponse } from 'next/server';

import { getUserClerk } from '@/features/user-profile-info/api';
import { deleteUserClerk } from '@/widgets/dashboard-users/api';
import { deleteUserSchema } from '@/widgets/dashboard-users/model/validation-schemes';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const result = await getUserClerk(userId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/users-clerk error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const userId = await params;

    // валидация при помощи zod
    const validation = deleteUserSchema.safeParse(userId);
    // console.log('DELETE validation:', validation);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          message: validation.error.message,
        },
        { status: 400 }
      );
    }
    const result = await deleteUserClerk(validation.data);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('DELETE /api/users/[userId] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

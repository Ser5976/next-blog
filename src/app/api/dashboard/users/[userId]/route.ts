import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    if (!clerkUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Получаем статистику из базы данных
    const userStats = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        _count: {
          select: {
            posts: true,
            comments: true,
            ratings: true,
            likes: true,
            dislikes: true,
          },
        },
      },
    });

    const user = {
      id: clerkUser.id,
      clerkId: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      imageUrl: clerkUser.imageUrl,
      role: (clerkUser.publicMetadata?.role as string) || 'user',
      createdAt: clerkUser.createdAt,
      updatedAt: clerkUser.updatedAt,
      lastSignInAt: clerkUser.lastSignInAt,
      _count: userStats?._count || {
        posts: 0,
        comments: 0,
        ratings: 0,
        likes: 0,
        dislikes: 0,
      },
    };

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch user profile',
      },
      { status: 500 }
    );
  }
}

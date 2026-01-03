import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Увеличиваем счетчик просмотров
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
      select: {
        id: true,
        viewCount: true,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('View count increment error:', error);
    return NextResponse.json(
      { error: 'Failed to increment view count' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (
      sessionClaims?.metadata?.role !== 'admin' &&
      sessionClaims?.metadata?.role !== 'author'
    ) {
      throw new Error('Insufficient rights to delete users');
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Post removed' });
  } catch (error) {
    console.error('The post is not remoed:', error);
    return NextResponse.json('The post is not remoed', { status: 500 });
  }
}

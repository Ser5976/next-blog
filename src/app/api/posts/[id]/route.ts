import { NextRequest, NextResponse } from 'next/server';

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

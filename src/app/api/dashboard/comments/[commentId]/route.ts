import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api';
import { updateCommentAction } from '@/widgets/dashboard-comments/api';
import { UpdateCommentParams } from '@/widgets/dashboard-comments/model';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const body = await request.json();

    const { content } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        {
          success: false,
          message: 'Content is required',
        },
        { status: 400 }
      );
    }

    const updateParams: UpdateCommentParams = {
      commentId,
      content,
    };

    const result = await updateCommentAction(updateParams);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to update comment',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;

    // Проверяем авторизацию и роль
    const { userId: currentUserId, sessionClaims } = await auth();

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (
      sessionClaims?.metadata?.role !== 'admin' &&
      sessionClaims?.metadata?.role !== 'author'
    ) {
      throw new Error('Insufficient rights to delete comments');
    }

    // Удаляем комментарий (каскадное удаление лайков и ответов)
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user comment:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to delete comment',
      },
      { status: 500 }
    );
  }
}

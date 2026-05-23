import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';
import { commentFormSchema } from '@/shared/schemas/comment-form-schemas';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;
    const body = await request.json();

    // валидация body при помощи zod
    const { data, success, error } = commentFormSchema.safeParse(body.content);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error,
        },
        { status: 400 }
      );
    }

    const { userId: currentUserId, sessionClaims } = await auth();
    const role = sessionClaims?.metadata?.role as string | undefined;

    if (!currentUserId) {
      return NextResponse.json(
        { success: false, message: 'Not authorized' },
        { status: 401 }
      );
    }

    if (role !== 'admin' && role !== 'author') {
      return NextResponse.json(
        { success: false, message: 'Insufficient rights to update comments' },
        { status: 403 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }

    if (role === 'author' || role === 'admin') {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: currentUserId },
        select: { id: true },
      });

      if (!dbUser || dbUser.id !== comment.authorId) {
        return NextResponse.json(
          { success: false, message: 'You can edit only your own comments' },
          { status: 403 }
        );
      }
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content: data.content },
      select: { id: true, content: true },
    });

    return NextResponse.json({
      success: true,
      message: 'Comment updated successfully',
      comment: updatedComment,
    });
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
    const role = sessionClaims?.metadata?.role as string | undefined;

    if (!currentUserId) {
      throw new Error('Not authorized');
    }

    if (role !== 'admin' && role !== 'author') {
      throw new Error('Insufficient rights to delete comments');
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, message: 'Comment not found' },
        { status: 404 }
      );
    }

    if (role === 'author') {
      const dbUser = await prisma.user.findUnique({
        where: { clerkId: currentUserId },
        select: { id: true },
      });

      if (!dbUser || dbUser.id !== comment.authorId) {
        return NextResponse.json(
          { success: false, message: 'You can delete only your own comments' },
          { status: 403 }
        );
      }
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

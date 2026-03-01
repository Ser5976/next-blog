// app/api/dashboard/articles/[id]/route.ts
import { NextResponse } from 'next/server';

import {
  deleteArticleAction,
  togglePublishArticleAction,
} from '@/widgets/dashboard-articles/api';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await deleteArticleAction(params.id);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/dashboard/articles/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { published } = await request.json();

    const result = await togglePublishArticleAction(params.id, published);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in PATCH /api/dashboard/articles/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

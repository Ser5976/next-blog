import { NextResponse } from 'next/server';

import { getArticlesAction } from '@/widgets/dashboard-articles/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 10,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      tag: searchParams.get('tag') || undefined,
      published:
        searchParams.get('published') === 'true'
          ? true
          : searchParams.get('published') === 'false'
            ? false
            : undefined,
      sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
      sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    };

    const result = await getArticlesAction(filters);

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/dashboard/articles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

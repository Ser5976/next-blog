import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api';

// GET  - получение всех тегов
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

// POST - создание тега
export async function POST(request: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const body = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 });
    }

    if (sessionClaims?.metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient rights' },
        { status: 403 }
      );
    }

    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Проверка на уникальность slug
    const existingTag = await prisma.tag.findUnique({
      where: { slug },
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'Tag with this slug already exists' },
        { status: 409 }
      );
    }

    const tag = await prisma.tag.create({
      data: { name, slug },
    });

    return NextResponse.json({ success: true, tag });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: 'Failed to create tag' },
      { status: 500 }
    );
  }
}

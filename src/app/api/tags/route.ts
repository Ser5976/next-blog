import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';
import { tagFormSchema } from '@/shared/schemas';

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

    // валидация body при помощи zod
    const { data, success, error } = tagFormSchema.safeParse(body);

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

    // Проверка на уникальность slug
    const existingTag = await prisma.tag.findUnique({
      where: { slug: data.slug },
    });

    if (existingTag) {
      return NextResponse.json(
        {
          success: false,
          error: 'SLUG_ALREADY_EXISTS',
          message: `An article with the slug "${data.slug}" already exists. Please choose a different slug.`,
          field: 'slug',
        },
        { status: 409 } // 409 Conflict
      );
    }

    const tag = await prisma.tag.create({
      data: { name: data.name, slug: data.slug },
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

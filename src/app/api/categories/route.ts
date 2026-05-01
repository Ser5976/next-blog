import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

import { prisma } from '@/shared/api/prisma';
import { categoryFormSchema } from '@/shared/schemas';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);
    return NextResponse.json('Something went wrong', { status: 500 });
  }
}

// создание категории
export async function POST(request: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    const body = await request.json();
    console.log('body:', body);

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
    const { data, success, error } = categoryFormSchema.safeParse(body);

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
    const existingCategory = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
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

    const category = await prisma.category.create({
      data: { name: data.name, slug: data.slug },
    });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

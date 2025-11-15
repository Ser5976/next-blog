'use server';

import { revalidatePath } from 'next/cache';

import { prisma } from '@/shared/api';

export async function deleteUser(clerkId: string) {
  await prisma.user.delete({ where: { clerkId } });
  await prisma.failedUserDeletion.updateMany({
    where: { clerkId },
    data: { resolved: true },
  });
  revalidatePath('/dashboard/failed-deletions');
}

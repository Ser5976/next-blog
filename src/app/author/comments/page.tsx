import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { AuthorComments } from '@/widgets/author-comments';

export default async function AuthorCommentsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in?redirect_url=/author/comments');
  }

  return <AuthorComments userId={userId} />;
}

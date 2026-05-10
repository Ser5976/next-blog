import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { AuthorArticles } from '@/widgets/author-articles';

export default async function AuthorArticlesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in?redirect_url=/author/articles');
  }

  return <AuthorArticles userId={userId} />;
}

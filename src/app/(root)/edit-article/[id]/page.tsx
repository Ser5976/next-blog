import { EditArticle } from '@/features/edit-article';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditArticle articleId={id} />;
}

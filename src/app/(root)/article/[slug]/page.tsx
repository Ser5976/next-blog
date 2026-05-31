interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  return <div className="container mx-auto py-8">{slug}</div>;
}

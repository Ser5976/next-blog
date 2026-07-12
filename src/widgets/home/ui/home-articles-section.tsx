import { getArticlesServer } from '@/entities/get-articles/api';
import { Subtitle, Title, UniversalEmpty, UniversalError } from '@/shared/ui';
import { HomeArticlesSectionProps } from '../model';
import { ArticleCardBig } from './article-card-big';

export const HomeArticlesSection = async ({
  id,
  title,
  subtitle,
  limit = 6,
}: HomeArticlesSectionProps) => {
  const data = await getArticlesServer({
    page: 1,
    limit: limit,
    published: true,
  });

  if (!data) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        data-testid="articles-section"
        className="container mx-auto max-w-7xl p-4"
      >
        <UniversalError
          title="Failed to load articles"
          message="Something went wrong while fetching articles."
          variant="card"
        />
      </div>
    );
  }
  if (data.articles.length === 0) {
    return (
      <div role="status" aria-live="polite" data-testid={`${id}-empty`}>
        <UniversalEmpty
          title="No articles yet"
          description="Check back soon for new health and wellness content."
        />
      </div>
    );
  }

  return (
    <section
      id={id}
      className="border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 py-16 dark:border-gray-800 dark:from-gray-950 dark:to-gray-900 md:py-20"
      aria-labelledby={`${id}-title`}
      data-testid={`${id}-section`}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-10">
          <Title as="h2" id={`${id}-title`}>
            {title}
          </Title>
          <Subtitle className="mt-2 max-w-2xl text-base">{subtitle}</Subtitle>
        </div>

        {data?.articles.length === 0 && (
          <div role="status" aria-live="polite" data-testid={`${id}-empty`}>
            <UniversalEmpty
              title="No articles yet"
              description="Check back soon for new health and wellness content."
            />
          </div>
        )}

        <div
          className="grid gap-25 sm:grid-cols-1 lg:grid-cols-2"
          role="list"
          aria-label={`${title} articles list`}
          data-testid={`${id}-list`}
        >
          {data.articles.map((article) => (
            <ArticleCardBig
              article={article}
              key={article.id}
              data-testid={`${id}-article-${article.id}`}
              role="listitem"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

import { Suspense } from 'react';

import { ArticlesSkeleton } from './articles-skeleton';
import { CategoriesSection } from './categories-section';
import { CategoriesSkeleton } from './categories-skeleton';
import { CtaSection } from './cta-section';
import { HeroSection } from './hero-section';
import { HomeArticlesSection } from './home-articles-section';

export const HomePage = async () => {
  return (
    <>
      <HeroSection />
      <Suspense
        fallback={
          <ArticlesSkeleton
            title="Latest Articles"
            subtitle="Fresh insights on nutrition, fitness, mental health, and balanced living."
            limit={6}
          />
        }
      >
        <HomeArticlesSection
          id="latest-articles"
          title="Latest Articles"
          subtitle="Fresh insights on nutrition, fitness, mental health, and balanced living."
          filters={{ sortBy: 'createdAt', sortOrder: 'desc' }}
          limit={6}
        />
      </Suspense>

      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSection />
      </Suspense>

      <Suspense
        fallback={
          <ArticlesSkeleton
            title="Popular Reads"
            subtitle="Most viewed articles loved by our community."
            limit={3}
          />
        }
      >
        <HomeArticlesSection
          title="Popular Reads"
          subtitle="Most viewed articles loved by our community."
          filters={{ sortBy: 'viewCount', sortOrder: 'desc' }}
          limit={3}
        />
      </Suspense>

      <CtaSection />
    </>
  );
};

import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';
import { ArticlesStats } from './articles-stats';
import { CategoriesStats } from './categories-stats';
import { StatsSkeleton } from './stats-skeleton';

interface HeroSectionProps {
  'data-testid'?: string;
}

export const HeroSection = ({
  'data-testid': dataTestId = 'hero-section',
}: HeroSectionProps = {}) => {
  return (
    <section
      className="relative min-h-[600px] w-full overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-green-950"
      aria-labelledby="hero-title"
      aria-label="Hero section - Start your journey to healthy life"
      data-testid={dataTestId}
    >
      {/* Декоративный фон */}
      <div
        className="absolute inset-0 before:absolute before:left-1/4 before:top-0 before:h-[500px] before:w-[500px] before:rounded-full before:bg-gradient-to-r before:from-emerald-600/20 before:to-teal-600/20 before:blur-3xl"
        aria-hidden="true"
        data-testid={`${dataTestId}-decoration`}
      />

      <div className="container relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 py-24 md:flex-row md:py-32">
        <div
          className="flex-1 space-y-8 text-center md:text-left"
          data-testid={`${dataTestId}-content`}
        >
          <h1
            id="hero-title"
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl"
            data-testid={`${dataTestId}-title`}
          >
            Start your journey to
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {' '}
              Healthy Life
            </span>
          </h1>

          <p
            className="mx-auto max-w-2xl text-lg text-gray-300 md:mx-0 md:text-xl"
            data-testid={`${dataTestId}-description`}
          >
            Discover expert articles, practical advice, and scientific research
            on healthy nutrition, fitness, mental health, and a balanced
            lifestyle.
          </p>

          <div
            className="flex flex-col items-center gap-4 sm:flex-row md:justify-start"
            role="group"
            aria-label="Call to action buttons"
            data-testid={`${dataTestId}-actions`}
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6 text-lg hover:from-emerald-700 hover:to-teal-700"
              data-testid={`${dataTestId}-start-reading`}
            >
              <Link
                href="#latest-articles"
                aria-label="Start reading latest health articles"
              >
                Start Reading
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-emerald-400 px-8 py-6 text-lg text-emerald-400 hover:bg-emerald-400 hover:text-white"
              data-testid={`${dataTestId}-explore-topics`}
            >
              <Link
                href="#categories"
                aria-label="Explore all health topics and categories"
              >
                Explore Topics
              </Link>
            </Button>
          </div>

          <div
            className="grid grid-cols-3 gap-4 pt-8 text-white md:max-w-md"
            role="list"
            aria-label="Health platform statistics"
            data-testid={`${dataTestId}-stats`}
          >
            <Suspense
              fallback={
                <StatsSkeleton
                  data-testid={`${dataTestId}-stats-skeleton-articles`}
                />
              }
            >
              <ArticlesStats data-testid={`${dataTestId}-stats-articles`} />
            </Suspense>
            <Suspense
              fallback={
                <StatsSkeleton
                  data-testid={`${dataTestId}-stats-skeleton-categories`}
                />
              }
            >
              <CategoriesStats data-testid={`${dataTestId}-stats-categories`} />
            </Suspense>

            <div
              className="space-y-2"
              role="listitem"
              aria-label="Free expert content available"
              data-testid={`${dataTestId}-free-content`}
            >
              <div
                className="text-2xl font-bold text-emerald-400"
                aria-hidden="true"
                data-testid={`${dataTestId}-free-content-value`}
              >
                Free
              </div>
              <div
                className="text-sm text-gray-400"
                aria-hidden="true"
                data-testid={`${dataTestId}-free-content-label`}
              >
                Expert Content
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-12 flex-1 md:mt-0"
          data-testid={`${dataTestId}-image-wrapper`}
        >
          <div
            className={cn(
              'relative mx-auto h-64 w-64 overflow-hidden rounded-2xl',
              'bg-gradient-to-br from-white/5 to-transparent',
              'border border-emerald-400/20 backdrop-blur-lg',
              'shadow-2xl shadow-emerald-500/10'
            )}
            aria-hidden="true"
            data-testid={`${dataTestId}-image-container`}
          >
            <Image
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Fresh vegetables and fruits representing healthy lifestyle and nutrition"
              fill
              className="object-cover"
              priority
              data-testid={`${dataTestId}-image`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

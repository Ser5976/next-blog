import Link from 'next/link';
import { PenLine, Search } from 'lucide-react';

import { Button } from '@/shared/ui';

interface CtaSectionProps {
  'data-testid'?: string;
}

export const CtaSection = ({
  'data-testid': dataTestId = 'cta-section',
}: CtaSectionProps = {}) => {
  return (
    <section
      className="border-t border-gray-200 py-16 dark:border-gray-800 md:py-20"
      aria-labelledby="cta-title"
      data-testid={dataTestId}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 px-6 py-12 text-center text-white shadow-xl md:px-12 md:py-16"
          role="region"
          aria-label="Call to action - Join the community"
          data-testid={`${dataTestId}-banner`}
        >
          {/* Декоративные элементы */}
          <div
            className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
            data-testid={`${dataTestId}-decoration-top`}
          />
          <div
            className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
            data-testid={`${dataTestId}-decoration-bottom`}
          />

          <div
            className="relative mx-auto max-w-2xl space-y-6"
            data-testid={`${dataTestId}-content`}
          >
            <h2
              id="cta-title"
              className="text-3xl font-bold tracking-tight md:text-4xl"
              data-testid={`${dataTestId}-title`}
            >
              Ready to improve your wellbeing?
            </h2>
            <p
              className="text-lg text-emerald-50"
              data-testid={`${dataTestId}-description`}
            >
              Search our library of expert articles or share your own knowledge
              with the VitaFlow community.
            </p>

            <div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              role="group"
              aria-label="Call to action buttons"
              data-testid={`${dataTestId}-actions`}
            >
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full px-8"
                data-testid={`${dataTestId}-search-button`}
              >
                <Link
                  href="/search"
                  aria-label="Search articles in the library"
                >
                  <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                  Search Articles
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
                data-testid={`${dataTestId}-write-button`}
              >
                <Link
                  href="/create-article"
                  aria-label="Write and share your own article"
                >
                  <PenLine className="mr-2 h-4 w-4" aria-hidden="true" />
                  Write an Article
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

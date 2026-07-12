import Link from 'next/link';
import { PenLine, Search } from 'lucide-react';

import { Button } from '@/shared/ui';

export const CtaSection = () => {
  return (
    <section className="border-t border-gray-200 py-16 dark:border-gray-800 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 px-6 py-12 text-center text-white shadow-xl md:px-12 md:py-16">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Ready to improve your wellbeing?
            </h2>
            <p className="text-lg text-emerald-50">
              Search our library of expert articles or share your own knowledge
              with the VitaFlow community.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full px-8"
              >
                <Link href="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Search Articles
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/40 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/create-article">
                  <PenLine className="mr-2 h-4 w-4" />
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

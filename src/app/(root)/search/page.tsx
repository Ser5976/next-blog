import { Suspense } from 'react';

import { SearchResults, SearchResultsSkeleton } from '@/widgets/search';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <SearchResultsSkeleton title="Search" subtitle="Loading search..." />
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}

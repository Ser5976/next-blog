import { cn } from '@/shared/lib';

export const CategoryPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Скелетон хедера - с фиксированной минимальной высотой */}
      <section
        className={cn(
          'relative overflow-hidden border-b border-border/60',
          'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
          'dark:from-emerald-950/40 dark:via-gray-950 dark:to-teal-950/30',
          // Фиксируем минимальную высоту как у реального хедера
          'min-h-[200px] md:min-h-[240px]'
        )}
      >
        {/* Декоративные элементы */}
        <div
          className="pointer-events-none absolute inset-0 before:absolute before:left-1/3 before:top-0 before:h-[320px] before:w-[320px] before:rounded-full before:bg-gradient-to-r before:from-emerald-400/15 before:to-teal-400/15 before:blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 opacity-10 blur-3xl"
          aria-hidden="true"
        />

        <div className="container relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-start gap-8">
            {/* Иконка - фиксированный размер */}
            <div className="h-20 w-20 shrink-0 animate-pulse rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />

            <div className="flex-1 space-y-4">
              {/* Бейджи - фиксированная высота */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-28 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Заголовок - точные размеры */}
              <div className="h-10 w-64 animate-pulse rounded bg-gray-200 dark:bg-gray-700 md:h-12 md:w-96" />

              {/* Подзаголовок - одна строка с точной высотой */}
              <div className="mt-1 max-w-2xl md:mx-0">
                <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700 md:h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Остальной контент */}
      <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Заголовок секции */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <div>
                <div className="h-9 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="mt-1 h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>

            {/* Сетка карточек */}
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col">
                  <div className="relative mb-5 aspect-[16/9] w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
                  <div className="flex flex-col space-y-3">
                    <div className="space-y-1.5">
                      <div className="h-5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-3.5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-3.5 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-3.5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="h-3.5 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <div className="h-5 w-14 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                      <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                      <div className="h-5 w-12 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Пагинация */}
            <div className="pt-4 border-t mt-8">
              <div className="flex justify-center">
                <div className="flex items-center gap-1">
                  <div className="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                  <div className="h-8 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Сайдбар */}
          <div className="lg:col-span-1 space-y-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-5 w-5 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                <div className="h-6 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                        <div className="h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

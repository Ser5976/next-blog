import Image from 'next/image';

import { cn } from '@/shared/lib';
import { Button } from '@/shared/ui';

export default function Home() {
  return (
    <>
      <section className="relative min-h-[600px] w-full overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-green-950">
        {/* Gradient overlay */}
        <div className="absolute inset-0 before:absolute before:left-1/4 before:top-0 before:h-[500px] before:w-[500px] before:rounded-full before:bg-gradient-to-r before:from-emerald-600/20 before:to-teal-600/20 before:blur-3xl" />

        <div className="container relative mx-auto max-w-7xl flex h-full flex-col items-center justify-center px-4 py-24 md:flex-row md:py-32">
          {/* Content */}
          <div className="flex-1 space-y-8 text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Start your journey to
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                {' '}
                Healthy Life
              </span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">
              Discover expert articles, practical advice, and scientific
              research on healthy nutrition, fitness, mental health, and a
              balanced lifestyle.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row md:justify-start">
              <Button
                size="lg"
                className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Start Reading
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 text-lg border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-white"
              >
                Explore Topics
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 text-white md:max-w-md">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-emerald-400">500+</div>
                <div className="text-sm text-gray-400">
                  Articles about Health
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-emerald-400">25+</div>
                <div className="text-sm text-gray-400">Experts</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-emerald-400">50K+</div>
                <div className="text-sm text-gray-400">Readers per Month</div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex-1 md:mt-0">
            <div
              className={cn(
                'relative mx-auto h-64 w-64 rounded-2xl overflow-hidden',
                'bg-gradient-to-br from-white/5 to-transparent',
                'border border-emerald-400/20 backdrop-blur-lg',
                'shadow-2xl shadow-emerald-500/10'
              )}
            >
              <Image
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Здоровый образ жизни"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

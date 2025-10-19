'use client';

import { CheckCircle2, X } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { useWelcomeBanner } from '../model';

interface WelcomeBannerProps {
  autoHideDuration?: number;
  className?: string;
}

export function WelcomeBanner({ autoHideDuration = 5000 }: WelcomeBannerProps) {
  const { isVisible, closeBanner } = useWelcomeBanner(autoHideDuration);

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 transform -translate-x-1/2 z-1000 w-full max-w-4xl px-4 transition-all duration-500 ease-out',
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4 pointer-events-none'
      )}
    >
      <Card
        className="w-full border-2 shadow-sm
          text-green-800 dark:text-green-300 bg-green-50/80 dark:bg-green-950/20
          border-green-200 dark:border-green-800
          transition-all duration-1000 ease-out"
        role="alert"
        aria-live="polite"
        aria-label="Welcome message"
        aria-hidden={!isVisible}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div
                className={cn(
                  'flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400 transition-transform duration-300 delay-150',
                  isVisible ? 'scale-100' : 'scale-75'
                )}
              >
                <CheckCircle2 className="w-5 h-5" />
              </div>

              <div
                className={cn(
                  'flex-1 space-y-1 transition-opacity duration-500 delay-100',
                  isVisible ? 'opacity-100' : 'opacity-0'
                )}
              >
                <h3 className="font-semibold text-base">Welcome aboard! 🎉</h3>
                <p className="text-sm leading-relaxed">
                  Your account has been successfully created and youre all set
                  to start exploring.
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={closeBanner}
              className={cn(
                'flex-shrink-0 h-8 w-8 hover:bg-background hover:text-current cursor-pointer transition-opacity duration-300 delay-300',
                isVisible ? 'opacity-100' : 'opacity-0'
              )}
              aria-label="Close welcome message"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

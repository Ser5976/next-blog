'use client';

import { CheckCircle2, X } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { useWelcomeBanner } from '../model';

interface WelcomeBannerProps {
  autoHideDuration?: number;
  variant?: 'success' | 'info' | 'warning';
  className?: string;
}

export function WelcomeBanner({
  autoHideDuration = 5000,
  variant = 'success',
  className,
}: WelcomeBannerProps) {
  const { isVisible, closeBanner } = useWelcomeBanner(autoHideDuration);

  const variantConfig = {
    success: {
      border: 'border-green-200 dark:border-green-800',
      background: 'bg-green-50/80 dark:bg-green-950/20',
      text: 'text-green-800 dark:text-green-300',
      icon: 'text-green-600 dark:text-green-400',
    },
    info: {
      border: 'border-blue-200 dark:border-blue-800',
      background: 'bg-blue-50/80 dark:bg-blue-950/20',
      text: 'text-blue-800 dark:text-blue-300',
      icon: 'text-blue-600 dark:text-blue-400',
    },
    warning: {
      border: 'border-yellow-200 dark:border-yellow-800',
      background: 'bg-yellow-50/80 dark:bg-yellow-950/20',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: 'text-yellow-600 dark:text-yellow-400',
    },
  };

  const currentVariant = variantConfig[variant];

  if (!isVisible) return null;

  return (
    <Card
      className={cn(
        'w-full max-w-4xl mx-auto mb-6 border-2 shadow-sm animate-in fade-in-0 slide-in-from-top-8 duration-500',
        currentVariant.border,
        currentVariant.background,
        className
      )}
      role="alert"
      aria-live="polite"
      aria-label="Welcome message"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={cn('flex-shrink-0 mt-0.5', currentVariant.icon)}>
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <div className="flex-1 space-y-1">
              <h3
                className={cn('font-semibold text-base', currentVariant.text)}
              >
                Welcome aboard! 🎉
              </h3>
              <p className={cn('text-sm leading-relaxed', currentVariant.text)}>
                Your account has been successfully created and youre all set to
                start exploring.
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={closeBanner}
            className={cn(
              'flex-shrink-0 h-8 w-8 hover:bg-background',
              currentVariant.text,
              'hover:text-current'
            )}
            aria-label="Close welcome message"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

interface RatingStarsProps {
  rating: number | null;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

export function RatingStars({
  rating,
  onRate,
  readonly = false,
  size = 'md',
  showValue = false,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating ?? rating ?? 0;
  const roundedRating = Math.round(displayRating * 2) / 2;

  const handleClick = (value: number) => {
    if (!readonly && onRate) {
      onRate(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isHalf = roundedRating >= star - 0.5 && roundedRating < star;
          const isFull = roundedRating >= star;

          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              onMouseEnter={() => !readonly && setHoverRating(star)}
              onMouseLeave={() => !readonly && setHoverRating(null)}
              disabled={readonly}
              className={cn(
                'transition-transform hover:scale-110 focus:outline-none',
                !readonly && 'cursor-pointer'
              )}
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'transition-colors',
                  isFull || isHalf
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-none text-gray-300 dark:text-gray-600'
                )}
                style={
                  isHalf
                    ? {
                        clipPath: 'inset(0 50% 0 0)',
                      }
                    : undefined
                }
              />
            </button>
          );
        })}
      </div>
      {showValue && rating !== null && (
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

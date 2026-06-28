'use client';

import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

import { useRatePost, useUserRating } from '@/features/rating-article/hooks';
import { RatingStars } from '@/shared/components';
import { RatingArticleProps } from '../model';

export function RatingArticle({
  postId,
  currentRating,
  ratingCount,
}: RatingArticleProps) {
  const { isSignedIn } = useAuth();
  const { data: userRating } = useUserRating(postId);

  const ratePostMutation = useRatePost(postId);

  const handleRate = async (rating: number) => {
    if (!isSignedIn) {
      toast.error('Please sign in to rate this article');
      return;
    }

    try {
      await ratePostMutation.mutateAsync(rating);
      toast.success('Thank you for your rating!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to submit rating');
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 text-center dark:border-gray-800 dark:from-gray-900 dark:to-gray-900">
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        Rate this article
      </h3>
      <div className="mb-3 flex justify-center">
        <RatingStars
          rating={userRating ?? currentRating}
          onRate={handleRate}
          size="lg"
          showValue
        />
      </div>
      {ratingCount > 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Based on {ratingCount} rating{ratingCount !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  );
}

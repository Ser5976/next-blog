'use client';

import { useEffect } from 'react';

export const useTrackView = (postId: string) => {
  useEffect(() => {
    const trackView = async () => {
      try {
        // Проверяем, не просматривалась ли уже эта статья в этой сессии
        const viewedPosts = JSON.parse(
          sessionStorage.getItem('viewedPosts') || '[]'
        );

        if (!viewedPosts.includes(postId)) {
          await fetch(`/api/posts/${postId}/view`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // Добавляем ID в список просмотренных
          viewedPosts.push(postId);
          sessionStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
        }
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    if (postId) {
      trackView();
    }
  }, [postId]);
};

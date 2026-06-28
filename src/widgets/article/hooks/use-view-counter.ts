import { useEffect, useRef } from 'react';
import axios from 'axios';

export function useViewCounter(postId: string) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!postId || hasIncremented.current) return;

    const incrementView = async () => {
      try {
        await axios.post(`/api/posts/${postId}/view`);
        hasIncremented.current = true;
      } catch (error) {
        console.error('Failed to increment view count:', error);
      }
    };

    incrementView();
  }, [postId]);
}

import { ArticlesFilters } from '@/shared/api';
import { ArticlesResponse } from '../model/types';

export async function getArticlesServer(
  filters: ArticlesFilters
): Promise<ArticlesResponse | null> {
  try {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    });

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/posts?${params}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error('getArticlesServer: error:', error);
    return null;
  }
}

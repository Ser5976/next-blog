import { Category } from '../model';

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/categories/slug/${slug}`,
      {
        cache: 'force-cache',
        next: {
          revalidate: 60,
        },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error(`Error loading category: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error loading category', error);
    return null;
  }
}

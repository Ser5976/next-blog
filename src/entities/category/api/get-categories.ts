import { Category } from '../model';

export async function getCategories(): Promise<Category[] | undefined> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/categories`,
      {
        cache: 'force-cache',
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Error loading categories: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error loading categories', error);
    return undefined;
  }
}

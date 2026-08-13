import { Tag } from '@/entities/dashboard-get-tags';

export async function getTagBySlug(slug: string): Promise<Tag | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/tags/slug/${slug}`,
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
      throw new Error(`Error loading tag: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error loading tag', error);
    return null;
  }
}

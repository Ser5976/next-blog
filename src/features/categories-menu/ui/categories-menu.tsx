import { CategoryLink, getCategories } from '@/entities/category';

export const CategoriesMenu = async () => {
  const categories = await getCategories();

  if (!categories) {
    return (
      <nav aria-label="Categories">
        <ul className="flex gap-4" role="list">
          <li className="text-sm text-muted-foreground">⚠️ What went wrong</li>
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Categories" className="hidden md:flex gap-6">
      <ul className="flex gap-4" role="list">
        {!categories ? (
          <li className="text-sm text-muted-foreground">⚠️ What went wrong</li>
        ) : categories.length === 0 ? (
          <li className="text-sm text-muted-foreground">No data available</li>
        ) : (
          categories.map((category) => (
            <CategoryLink key={category.id} category={category} />
          ))
        )}
      </ul>
    </nav>
  );
};

import { Category, CategoryLink } from '@/entities/category';

interface HeaderProps {
  categories: Category[] | undefined;
}

export const CategoriesMenu = ({ categories }: HeaderProps) => {
  return (
    <nav aria-label="categories" className="hidden md:flex gap-6">
      <ul className="flex gap-4" role="list">
        {!categories ? (
          <li className="text-sm text-muted-foreground">⚠️ What went wrong</li>
        ) : categories.length === 0 ? (
          <li className="text-sm text-muted-foreground">No data available</li>
        ) : (
          categories.map((category) => (
            <li key={category.id}>
              <CategoryLink category={category} />
            </li>
          ))
        )}
      </ul>
    </nav>
  );
};

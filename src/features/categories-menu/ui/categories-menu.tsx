import { Category, CategoryLink } from '@/entities/category';

interface CategoriesMenuProps {
  categories: Category[] | undefined;
}

export const CategoriesMenu = ({ categories }: CategoriesMenuProps) => {
  return (
    <nav aria-label="Main blog categories" className="hidden md:flex gap-6">
      <ul className="flex gap-4" role="list" aria-label="Categories list">
        {!categories ? (
          <li
            className="text-sm text-muted-foreground"
            aria-live="polite"
            aria-atomic="true"
          >
            ⚠️ What went wrong
          </li>
        ) : categories.length === 0 ? (
          <li
            className="text-sm text-muted-foreground"
            aria-live="polite"
            aria-atomic="true"
          >
            No data available
          </li>
        ) : (
          categories.map((category) => (
            <li key={category.id} role="listitem">
              <CategoryLink category={category} />
            </li>
          ))
        )}
      </ul>
    </nav>
  );
};

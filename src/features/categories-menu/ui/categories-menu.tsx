import { CategoryLink, getCategories } from '@/entities/category';
import { CategoriesDropdown } from './categories-dropdown';

export const CategoriesMenu = async () => {
  const categories = await getCategories();

  const VISIBLE_COUNT = 5;
  const visibleCategories = categories?.slice(0, VISIBLE_COUNT) ?? [];
  const hiddenCategories = categories?.slice(VISIBLE_COUNT) ?? [];

  return (
    <nav
      aria-label="Main blog categories"
      className="hidden lg:flex items-center"
    >
      <ul
        className="flex gap-4 items-center"
        role="list"
        aria-label="Categories list"
      >
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
          <>
            {visibleCategories.map((category) => (
              <li
                key={category.id}
                role="listitem"
                className="flex items-center"
              >
                <CategoryLink category={category} />
              </li>
            ))}
            {hiddenCategories.length > 0 && (
              <li role="listitem" className="flex items-center">
                <CategoriesDropdown categories={hiddenCategories} />
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

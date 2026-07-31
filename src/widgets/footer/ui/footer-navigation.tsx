import { CategoryLink, getCategories } from '@/entities/category';

export const FooterNavigation = async () => {
  const categories = await getCategories();
  return (
    <div aria-labelledby="sections-heading">
      <h4 id="sections-heading" className="font-semibold mb-3">
        Sections
      </h4>
      <nav aria-label="Категории блога">
        <ul className="flex flex-col gap-2" role="list">
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
              <li key={category.id}>
                <CategoryLink category={category} />
              </li>
            ))
          )}
        </ul>
      </nav>
    </div>
  );
};

import { CategoryLink, getCategories } from '@/entities/category';

export const MobileCategoriesList = async () => {
  const categories = await getCategories();
  if (!categories) {
    return <div>⚠️ Failed to load categories</div>;
  }

  if (categories.length === 0) {
    return <div>No categories available</div>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryLink category={category} />
        </li>
      ))}
    </ul>
  );
};

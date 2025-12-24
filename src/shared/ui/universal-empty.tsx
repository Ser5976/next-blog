import { FolderOpen, Search } from 'lucide-react';

export interface UniversalEmptyProps {
  /** Заголовок пустого состояния */
  title?: string;
  /** Описание пустого состояния */
  description?: string;
  /** Иконка для отображения */
  icon?: React.ReactNode;
  /** Размер иконки */
  iconSize?: 'sm' | 'md' | 'lg';
  /** Текст поискового запроса (если пустое состояние из-за поиска) */
  searchQuery?: string;
  /** Кастомный текст для поискового случая */
  searchMessage?: (query: string) => string;
  /** Кастомный текст для обычного пустого состояния */
  emptyMessage?: string;
  /** Дополнительный контент под описанием */
  children?: React.ReactNode;
  /** CSS классы */
  className?: string;
}

const iconSizes = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export function UniversalEmpty({
  title,
  description,
  icon,
  iconSize = 'md',
  searchQuery,
  searchMessage = (query) =>
    `No results match "${query}". Try a different search.`,
  emptyMessage = 'No data available',
  children,
  className = '',
}: UniversalEmptyProps) {
  // Определяем, показываем ли мы состояние поиска
  const isSearchState = Boolean(searchQuery);

  // Определяем размер иконки
  const iconSizeClass = iconSizes[iconSize];

  // Определяем заголовок
  const finalTitle = title || (isSearchState ? 'No results found' : 'No data');

  // Определяем описание
  const finalDescription =
    description || (isSearchState ? searchMessage(searchQuery!) : emptyMessage);

  // Функция для рендера иконки
  const renderIcon = () => {
    if (icon) {
      return icon;
    }

    const IconComponent = isSearchState ? Search : FolderOpen;
    return <IconComponent className={`${iconSizeClass}`} />;
  };

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-muted-foreground mx-auto w-fit mb-4">
        {renderIcon()}
      </div>

      <h3 className="text-lg font-medium mb-2">{finalTitle}</h3>

      <p className="text-muted-foreground">{finalDescription}</p>

      {children}
    </div>
  );
}

// Примеры использования:

// 1. С кастомной иконкой (просто передаем элемент)
// <UniversalEmpty
//   icon={<Users className="h-12 w-12" />}
//   title="No users"
// />

// 2. Стандартное использование
// <UniversalEmpty searchQuery={searchTerm} />

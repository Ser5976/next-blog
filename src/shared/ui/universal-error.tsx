import { AlertCircle } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';

export interface UniversalErrorProps {
  /** Объект ошибки */
  error?: Error | null;
  /** Текст ошибки (альтернатива error.message) */
  message?: string;
  /** Заголовок ошибки */
  title?: string;
  /** Кастомная иконка (если не указана - используется AlertCircle) */
  icon?: React.ReactNode;
  /** Размер иконки */
  iconSize?: 'sm' | 'md' | 'lg';
  /** Вариант отображения: card, inline, simple */
  variant?: 'card' | 'inline' | 'simple';
  /** Текст кнопки повторной попытки */
  retryButtonText?: string;
  /** Функция повторной попытки */
  onRetry?: () => void;
  /** Дополнительный контент под кнопкой */
  children?: React.ReactNode;
  /** CSS классы */
  className?: string;
  classNameCard?: string;
  /** test ID для тестирования */
  'data-testid'?: string;
}

const iconSizes = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export function UniversalError({
  error,
  message,
  title = 'Something went wrong',
  icon,
  iconSize = 'md',
  variant = 'card',
  retryButtonText = 'Try Again',
  onRetry,
  children,
  className = '',
  classNameCard = '',
  'data-testid': testId = 'universal-error',
}: UniversalErrorProps) {
  // Определяем текст ошибки
  const errorMessage = message || error?.message || 'An error occurred';

  // Определяем цвет иконки
  const iconColor = variant === 'simple' ? 'text-destructive' : 'text-red-500';

  // Определяем размер иконки
  const iconSizeClass = iconSizes[iconSize];

  // Рендер иконки
  const renderIcon = () => {
    const defaultIcon = (
      <AlertCircle
        className={`${iconSizeClass} mx-auto`}
        aria-hidden="true"
        data-testid="error-icon"
      />
    );
    const iconToRender = icon || defaultIcon;

    return (
      <div className={`${iconColor} mb-4`} data-testid="error-icon-container">
        {iconToRender}
      </div>
    );
  };

  // Базовый контент
  const errorContent = (
    <>
      {renderIcon()}
      <h3 className="text-lg font-medium mb-2" data-testid="error-title">
        {title}
      </h3>
      <p
        className="text-muted-foreground text-sm mb-6"
        data-testid="error-message"
      >
        {errorMessage}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant={variant === 'simple' ? 'outline' : 'default'}
          data-testid="error-retry-button"
        >
          {retryButtonText}
        </Button>
      )}
      {children && <div data-testid="error-children">{children}</div>}
    </>
  );

  // Рендер в зависимости от варианта
  switch (variant) {
    case 'inline':
      return (
        <div
          className={`text-center py-6 ${className}`}
          role="alert"
          aria-live="assertive"
          data-testid={`${testId}-inline`}
        >
          {errorContent}
        </div>
      );

    case 'simple':
      return (
        <div
          className={`text-center py-4 ${className}`}
          role="alert"
          aria-live="assertive"
          data-testid={`${testId}-simple`}
        >
          <div
            className="flex items-center justify-center gap-3 mb-2"
            data-testid="simple-error-header"
          >
            <AlertCircle
              className={`h-5 w-5 text-destructive ${iconSizeClass}`}
              aria-hidden="true"
              data-testid="simple-error-icon"
            />
            <h3
              className="text-md font-medium"
              data-testid="simple-error-title"
            >
              {title}
            </h3>
          </div>
          <p
            className="text-sm text-muted-foreground mb-4"
            data-testid="simple-error-message"
          >
            {errorMessage}
          </p>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              data-testid="simple-error-retry-button"
            >
              {retryButtonText}
            </Button>
          )}
          {children && (
            <div data-testid="simple-error-children">{children}</div>
          )}
        </div>
      );

    case 'card':
    default:
      return (
        <div
          className={` bg-background  ${className}`}
          role="alert"
          aria-live="assertive"
          data-testid={`${testId}-card`}
        >
          <Card data-testid="error-card" className={`${classNameCard}`}>
            <CardContent className="pt-6" data-testid="error-card-content">
              <div
                className="text-center py-12"
                data-testid="error-card-content-inner"
              >
                {errorContent}
              </div>
            </CardContent>
          </Card>
        </div>
      );
  }
}

// Примеры использования:

// 1. Базовый вариант (card, с иконкой AlertCircle)
// <UniversalError
//   error={error}
//   onRetry={() => refetch()}
// />

// 2. С кастомным заголовком и сообщением
// <UniversalError
//   title="Connection Lost"
//   message="Unable to connect to the server. Please check your internet connection."
//   onRetry={reconnect}
// />

// 3. Inline вариант для форм
// <UniversalError
//   message="Failed to save changes"
//   onRetry={saveData}
//   variant="inline"
// />

// 4. С дополнительным контентом
// <UniversalError
//   error={error}
//   onRetry={refetch}
// >
//   <p className="text-xs text-muted-foreground mt-4">
//     If the problem persists, contact support at support@example.com
//   </p>
// </UniversalError>

// 5. С кастомной иконкой
// <UniversalError
//   error={error}
//   icon={<WifiOff className="h-12 w-12" />}
//   title="No Internet Connection"
//   onRetry={checkConnection}
// />

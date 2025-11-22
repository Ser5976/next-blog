export function getDateFilter(
  timeRange: string | null,
  isPreviousPeriod: boolean = false
) {
  if (!timeRange) return null;

  const now = new Date();
  const filter: { gte: Date; lte?: Date } = { gte: new Date(now) };

  switch (timeRange) {
    case 'week':
      if (isPreviousPeriod) {
        // Предыдущая неделя: 14-7 дней назад
        filter.gte.setDate(now.getDate() - 14);
        filter.lte = new Date(now);
        filter.lte.setDate(now.getDate() - 7);
      } else {
        // Текущая неделя: последние 7 дней
        filter.gte.setDate(now.getDate() - 7);
      }
      break;
    case 'month':
      if (isPreviousPeriod) {
        // Предыдущий месяц: 2 месяца назад - 1 месяц назад
        filter.gte.setMonth(now.getMonth() - 2);
        filter.lte = new Date(now);
        filter.lte.setMonth(now.getMonth() - 1);
      } else {
        // Текущий месяц: последний месяц
        filter.gte.setMonth(now.getMonth() - 1);
      }
      break;
    case 'year':
      if (isPreviousPeriod) {
        // Предыдущий год: 2 года назад - 1 год назад
        filter.gte.setFullYear(now.getFullYear() - 2);
        filter.lte = new Date(now);
        filter.lte.setFullYear(now.getFullYear() - 1);
      } else {
        // Текущий год: последний год
        filter.gte.setFullYear(now.getFullYear() - 1);
      }
      break;
    default:
      return null;
  }

  return filter;
}

export function getPreviousPeriod(timeRange: string | null): string | null {
  if (!timeRange) return null;

  // Для упрощения возвращаем тот же период, но в реальности
  // нужно будет передавать конкретные даты предыдущего периода
  return timeRange;
}

export function calculateChange(
  currentVal: number,
  previousVal: number
): number {
  if (previousVal === 0) return currentVal > 0 ? 100 : 0;
  return ((currentVal - previousVal) / previousVal) * 100;
}

export function calculateChanges(
  current: {
    [key: string]: number;
  },
  previous: {
    [key: string]: number;
  }
): {
  [key: string]: number;
} {
  // Создаем объект для хранения результатов
  const changes: {
    [key: string]: number;
  } = {};

  // Проходим по всем ключам объекта current
  for (const key in current) {
    // Проверяем, что свойство принадлежит самому объекту (не унаследовано)
    // и что текущее значение - число
    if (
      current.hasOwnProperty(key) &&
      typeof current[key] === 'number' &&
      previous.hasOwnProperty(key) &&
      typeof previous[key] === 'number'
    ) {
      // Вычисляем процентное изменение для этого свойства
      changes[key] = calculateChange(
        current[key] as number,
        previous[key] as number
      );
    }
  }

  return changes;
}

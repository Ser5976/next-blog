export function getDateFilter(timeRange: string | null) {
  if (!timeRange) return null;

  const now = new Date();
  const filter: { gte: Date } = { gte: new Date(now) };

  switch (timeRange) {
    case 'week':
      filter.gte.setDate(now.getDate() - 7);
      break;
    case 'month':
      filter.gte.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      filter.gte.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return null;
  }

  return filter;
}

export function getPreviousPeriod(timeRange: string | null): string | null {
  if (!timeRange) return null;

  const previousMap = {
    week: 'week',
    month: 'month',
    year: 'year',
  };

  return previousMap[timeRange as keyof typeof previousMap] || null;
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

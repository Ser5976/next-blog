export function getDateFilter(
  timeRange: string | null,
  isPreviousPeriod: boolean = false
) {
  if (!timeRange) return null;

  const now = new Date();
  const filter: { gte: Date; lte: Date } = {
    gte: new Date(now),
    lte: new Date(now),
  };

  switch (timeRange) {
    case 'week':
      if (isPreviousPeriod) {
        // Предыдущая неделя: с 14 по 7 дней назад
        filter.gte.setDate(now.getDate() - 14);
        filter.lte.setDate(now.getDate() - 7);
      } else {
        // Текущая неделя: последние 7 дней
        filter.gte.setDate(now.getDate() - 7);
        filter.lte.setDate(now.getDate());
      }
      break;
    case 'month':
      if (isPreviousPeriod) {
        // Предыдущий месяц: с начала месяца 2 месяца назад до начала прошлого месяца
        filter.gte.setMonth(now.getMonth() - 2, 1);
        filter.lte.setMonth(now.getMonth() - 1, 0); // последний день предыдущего месяца
      } else {
        // Текущий месяц: с начала прошлого месяца до сейчас
        filter.gte.setMonth(now.getMonth() - 1);
        filter.lte.setMonth(now.getMonth());
      }
      break;
    case 'year':
      if (isPreviousPeriod) {
        // Предыдущий год: с начала года 2 года назад до начала прошлого года
        filter.gte.setFullYear(now.getFullYear() - 2, 0, 1);
        filter.lte.setFullYear(now.getFullYear() - 1, 0, 0);
      } else {
        // Текущий год: с начала прошлого года до сейчас
        filter.gte.setFullYear(now.getFullYear() - 1);
        filter.lte.setFullYear(now.getFullYear());
      }
      break;
    default:
      return null;
  }

  // Убедимся, что время установлено корректно
  filter.gte.setHours(0, 0, 0, 0);
  filter.lte.setHours(23, 59, 59, 999);

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

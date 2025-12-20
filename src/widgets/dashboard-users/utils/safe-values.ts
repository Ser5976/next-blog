export function safeNumber(
  value: number | undefined,
  defaultValue: number
): number {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  if (typeof value !== 'number' || isNaN(value)) {
    return defaultValue;
  }

  return value;
}

export function safeString(
  value: string | undefined,
  defaultValue: string = ''
): string {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  return String(value);
}

export function safeBoolean(
  value: boolean | undefined,
  defaultValue: boolean = false
): boolean {
  if (value === undefined || value === null) {
    return defaultValue;
  }

  return Boolean(value);
}

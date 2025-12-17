export const formatDate = (timestamp: number | null) => {
  if (!timestamp) return 'Never';

  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Invalid date';

    // Просто используем встроенный форматтер
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    return `Error ${error}`;
  }
};

export default function formatTime(
  timestamp: number | string,
  type: 'date' | 'time' | 'both' = 'both',
): string {
  const date = new Date(Number(timestamp));

  if (isNaN(date.getTime())) {
    return 'Invalid time value';
  }

  const optionsDate: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };

  if (type === 'date') {
    return date.toLocaleDateString('en-GB', optionsDate);
  }

  if (type === 'time') {
    return date.toLocaleTimeString('en-GB', optionsTime);
  }

  return (
    date.toLocaleDateString('en-GB', optionsDate) +
    ' ' +
    date.toLocaleTimeString('en-GB', optionsTime)
  );
}

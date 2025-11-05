export function formatCurrency(value: number | bigint, locale = 'en-NG') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
